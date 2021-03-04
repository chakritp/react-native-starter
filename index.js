//-- Shims --//

import 'react-native-gesture-handler' // react-navigation

//-- App --//

import { AppRegistry, LogBox } from 'react-native'
import { configureYup } from 'lib/form'
import { name as appName } from './app.json'
import { App } from './entry'

if (__DEV__) {
  // Warning message patterns go here...
  LogBox.ignoreLogs([
  ])
}

configureYup()

AppRegistry.registerComponent(appName, () => App)
