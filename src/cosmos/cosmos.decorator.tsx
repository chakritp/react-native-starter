import jest from 'jest-mock'
import React, { ReactNode, useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from '@shopify/restyle'
import { Toast } from 'components/core'
import { factory } from 'factories'
import { defaultTheme } from 'theme'
import { useMocks } from 'cosmos/helpers'

export default ({ children } : { children: ReactNode }) => {
  factory.cleanUp()
  useMocks()

  useEffect(() => () => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={defaultTheme}>
        <View style={{ flex: 1, backgroundColor: '#eee' }}>
          {children}
        </View>
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
