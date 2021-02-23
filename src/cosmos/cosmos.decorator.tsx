import jest from 'jest-mock'
import React, { ReactNode, useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from 'theme'
import { factory } from 'factories'
import { defaultTheme as theme } from 'theme'
import { useMocks } from 'cosmos/helpers'
import { Toast } from 'components/core'

export default ({ children } : { children: ReactNode }) => {
  factory.cleanUp()
  useMocks()

  useEffect(() => () => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  }, [])

  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <View style={{ flex: 1, backgroundColor: '#eee' }}>
          {children}
        </View>
        <Toast />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
