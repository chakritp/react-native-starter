//-- Shims --//

import 'react-native-gesture-handler' // react-navigation

//-- App --//

import { AppRegistry, LogBox } from 'react-native'
import * as Sentry from '@sentry/react-native'
import { SENTRY_DSN } from 'config'
import { name as appName } from './app.json'
import { App } from './entry'

Sentry.init({ dsn: SENTRY_DSN })

if (__DEV__) {
  // Warning message patterns go here...
  LogBox.ignoreLogs([
  ])
}

AppRegistry.registerComponent(appName, () => App)
