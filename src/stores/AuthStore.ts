import { Instance, types, applySnapshot, flow } from 'mobx-state-tree'
import { AsyncTask, runTask } from 'mst-async-task'
import { AuthUser } from 'models'
import { api } from 'services'
import { getDeviceKey } from 'utils/device'

export const AuthStore = types
  .model({
    deviceRegistered: types.optional(types.boolean, false),
    email: types.maybe(types.string),
    verificationToken: types.maybe(types.string),
    accessToken: types.maybe(types.string),
    user: types.maybe(AuthUser),
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

      setEmail(value: string) {
        self.email = value
      },

      requestCode: (params: { email?: string } = {}) => runTask(self.requestCodeTask, function*() {
        const email = params.email || self.email!
        yield self.registerDevice()
        const { data } = yield api.auth.requestCode({ email })
        self.email = email
        self.verificationToken = data.token
      }),

      signIn: (params: { code: string }) => runTask(self.signInTask, function*() {
        yield self.registerDevice()
        const { data } = yield api.auth.signIn({
          email: self.email,
          token: self.verificationToken,
          ...params
        })
        self.accessToken = data.accessToken
        self.user = AuthUser.create(data.user)
        api.client.authToken = data.accessToken
      }),

      loadUser: () => runTask(self.loadUserTask, function*() {
        const { data } = yield api.users.getProfile()
        if (self.user) {
          Object.assign(self.user, data)
        } else {
          self.user = AuthUser.create(data)
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
