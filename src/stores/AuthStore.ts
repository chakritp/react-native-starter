import { Instance, types, applySnapshot, flow } from 'mobx-state-tree'
import { AsyncTask, runTask } from 'lib/mst'
import { AuthUser } from 'models'
import { api } from 'services'
import { getDeviceKey } from 'utils/device'

export const AuthStore = types
  .model({
    deviceRegistered: types.optional(types.boolean, false),
    phoneNumber: types.maybe(types.string),
    verificationToken: types.maybe(types.string),
    accessToken: types.maybe(types.string),
    user: types.maybe(AuthUser),
    signUpTask: types.optional(AsyncTask, {}),
    requestCodeTask: types.optional(AsyncTask, {}),
    signInTask: types.optional(AsyncTask, {}),
    loadUserTask: types.optional(AsyncTask, {}),
  })
  .views(self => {
    return {
      get authenticated() {
        return !!self.accessToken
      },
      get hasRegistered() {
        return self.deviceRegistered || self.user 
      }
    }
  })
  .actions(_self => {
    const self = _self as IAuthStore

    return {
      initialize() {
        api.client.authToken = self.accessToken

        if (self.authenticated) {
          self.loadUser()
        }
      },

      registerDevice: flow(function*() {
        if (!self.deviceRegistered || __DEV__) {
          const key = yield getDeviceKey()

          try {
            yield api.devices.create({ key })
            self.deviceRegistered = true
          } catch (error) {
            if (error.status !== 409) {
              throw error
            }
          }
        }
      }),

      signUp: ({ phoneNumber }: { phoneNumber: string }) => runTask(self.signUpTask, function*({ exec }) {
        yield self.registerDevice()
        const { data } = yield api.auth.signUp({
          phoneNumber
        })
        self.user = AuthUser.create(data)
        yield exec(self.requestCode, { phoneNumber: data.phoneNumber })
      }),

      requestCode: ({ phoneNumber }: { phoneNumber?: string } = {}) => runTask(self.requestCodeTask, function*() {
        yield self.registerDevice()
        const { data } = yield api.auth.requestCode({
          phoneNumber: phoneNumber || self.phoneNumber
        })
        self.phoneNumber = phoneNumber
        self.verificationToken = data.token
      }),

      signIn: ({ code }: { code: string }) => runTask(self.signInTask, function*() {
        yield self.registerDevice()
        const { data } = yield api.auth.signIn({
          phoneNumber: self.phoneNumber || self.user!.phoneNumber,
          token: self.verificationToken,
          code
        })
        api.client.authToken = data.accessToken
        self.accessToken = data.accessToken
      }),

      loadUser: () => runTask(self.loadUserTask, function*() {
        try {
          const { data } = yield api.users.getProfile()
          if (self.user) {
            Object.assign(self.user, data)
          } else {
            self.user = AuthUser.create(data)
          }
        } catch (error) {
          console.log('error', error)
        }
      }),

      async signOut() {
        self.revokeAuth()
        try {
          await api.auth.signOut()
        } catch (error) {
          console.log(error)
        }
      },

      revokeAuth() {
        api.client.authToken = undefined
        applySnapshot(self, {})
      }
    }
  })

export interface IAuthStore extends Instance<typeof AuthStore> {}
