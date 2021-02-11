import { AppState, Linking } from 'react-native'
import { URL } from 'react-native-url-polyfill'
import { Instance, types, flow } from 'mobx-state-tree'

export const AppStore = types
  .model({})
  .actions(_self => {
    const self = _self as IAppStore
    
    return {
      initialize() {
        AppState.addEventListener('change', self.onAppStateChange)

        const urlListener = ({ url } : { url: string }) => self.handleDeepLink(url)
        Linking.addEventListener('url', urlListener)

        return () => {
          AppState.removeEventListener('change', self.onAppStateChange)
          Linking.removeEventListener('url', urlListener)
        }
      },
      
      handleInitialDeepLink: flow(function*() {
        try {
          const initialUrl = yield Linking.getInitialURL()
          if (initialUrl) {
            self.handleDeepLink(initialUrl)
          }
        } catch (error) {
          console.warn(error)
        }
      }),

      handleDeepLink(url: string) {
        try {
          const deepLink = parseDeepLink(url)
          if (deepLink) {
            const { path, params } = deepLink
            console.log("Received deep link", { path, params })
          }
        } catch (error) {
          console.warn(error)
        }
      },

      onAppStateChange(nextAppState: string) {
        if (nextAppState === 'active') {
          
        }
      }
    }
  })

function parseDeepLink(url: string) {
  try {
    const { protocol, host, pathname, searchParams } = new URL(url)

    if (protocol !== 'typescript-starter:') {
      return undefined
    }

    const params: { [key: string]: string } = {}

    for (const [name, value] of searchParams) {
      params[name] = value
    }

    return { path: `/${host}${pathname}`, params }
  } catch (error) {
    throw new Error(`Unable to parse url '${url}': ${error}`)
  }
}

export interface IAppStore extends Instance<typeof AppStore> {}
