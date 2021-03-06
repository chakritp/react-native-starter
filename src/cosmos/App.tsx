import React, { useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { NativeFixtureLoader } from 'react-cosmos/native'
import SplashScreen from 'react-native-splash-screen'
import { ThemeProvider } from '@shopify/restyle'
import { Toast } from 'components/core'
import { defaultTheme } from 'theme'
import { rendererConfig, fixtures, decorators } from '../../cosmos.userdeps'

export const App = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <ThemeProvider theme={defaultTheme}>
        <View style={{ flex: 1, backgroundColor: '#eee' }}>
          <NativeFixtureLoader
            rendererConfig={rendererConfig}
            fixtures={fixtures}
            decorators={decorators}
          />
        </View>
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
