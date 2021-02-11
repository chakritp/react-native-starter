import React, { useEffect } from 'react'
import { NativeFixtureLoader } from 'react-cosmos/native'
import SplashScreen from 'react-native-splash-screen'
import { rendererConfig, fixtures, decorators } from '../../cosmos.userdeps'

export const App = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <NativeFixtureLoader
      rendererConfig={rendererConfig}
      fixtures={fixtures}
      decorators={decorators}
    />
  )
}
