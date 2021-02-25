import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StoreProvider } from 'lib/mst'
// import { Root } from 'screens/Root'
import { Test } from 'Test'
import { RootStore } from 'stores'


export const App = () => {
  return (
    <SafeAreaProvider>
      <Test />
    </SafeAreaProvider>
  )
}
