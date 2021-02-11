import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StoreProvider } from 'lib/mst'
import { Root } from 'screens/Root'
import { RootStore } from 'stores'

const rootStore = RootStore.create()

export const App = () => {
  return (
    <StoreProvider value={rootStore}>
      <SafeAreaProvider>
        <Root />
      </SafeAreaProvider>
    </StoreProvider>
  )
}
