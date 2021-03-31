import { AppState, AppStateStatus, Linking } from 'react-native'
import { URL } from 'react-native-url-polyfill'
import { Instance, types, getParent, flow } from 'mobx-state-tree'
import { api, rootNavigation } from 'services'
import { IRootStore } from './RootStore'

export const AppStore = types
  .model({
    navigationReady: types.optional(types.boolean, false),
    upgradeRequired: types.optional(types.boolean, false)
  })
  .actions(_self => {
    const self = _self as IAppStore

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // ...
      }
    }

    const handleDeepLink = async (url: string) => {
      // Workaround for an error that may occur on iOS devices when
      // a network request is attempted while handling a universal link
      // and the app is in an inactive state.
      // https://github.com/AFNetworking/AFNetworking/issues/4279
      await waitForActiveAppState()

      try {
        const { pathname, params } = parseDeepLink(url)
        const { authStore } = getParent<IRootStore>(self)

        switch (pathname) {
          case '/auth/verify': {
            const { email, code } = params
            if (email && code && !authStore.authenticated) {
              authStore.setEmail(email)
              rootNavigation.reset({
                routes: [{
                  name: 'Auth',
                  state: {
                    index: 1,
                    routes: [{ name: 'SignIn' }, { name: 'Verify', params: { code } }]
                  } 
                }]
              })
            }
            break
          }
        }
      } catch (error) {
        console.warn(error)
      }
    }

    const handleApiError = ({ error }: { error: any }) => {
      const { authStore } = getParent<IRootStore>(self)
      if (error.status == 401 && authStore.authenticated) {
        authStore.revokeAuth()
      } else if (error.code === 'app_upgrade_required') {
        self.setUpgradeRequired(true)
      }
    }

    return {
      initialize() {
        AppState.addEventListener('change', handleAppStateChange)

        const urlListener = ({ url } : { url: string }) => handleDeepLink(url)
        Linking.addEventListener('url', urlListener)

        api.client.on('error', handleApiError)

        return () => {
          AppState.removeEventListener('change', handleAppStateChange)
          Linking.removeEventListener('url', urlListener)
          api.client.off('error', handleApiError)
        }
      },
      
      start: flow(function*() {
        const { authStore } = getParent<IRootStore>(self)
        const initialUrl = yield Linking.getInitialURL()

        if (initialUrl) {
          yield waitForActiveAppState()
          self.navigationReady = true
          handleDeepLink(initialUrl)
        } else {
          self.navigationReady = true
        }
        
        if (authStore.authenticated) {
          authStore.loadUser()
        }
      }),

      setUpgradeRequired(value: boolean) {
        self.upgradeRequired = value
      }
    }
  })

async function waitForActiveAppState() {
  return new Promise<void>((resolve) => {
    if (AppState.currentState === 'active') {
      return resolve()
    }
  
    const onChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        AppState.removeEventListener('change', onChange)
        resolve()
      }
    }
  
    AppState.addEventListener('change', onChange)
  })
}

function parseDeepLink(url: string) {
  try {
    const { host, pathname, searchParams } = new URL(url)
    const params: { [key: string]: string } = {}

    for (const [name, value] of searchParams) {
      params[name] = value
    }

    return { host, pathname, params }
  } catch (error) {
    throw new Error(`Unable to parse url '${url}': ${error}`)
  }
}

export interface IAppStore extends Instance<typeof AppStore> {}
