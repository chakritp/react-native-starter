import React from 'react'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { StoreProvider } from 'lib/mst'
import { Root } from 'screens/Root'
import { IRootStore, RootStore } from 'stores'

export interface AppProps {
  rootStore?: IRootStore
}

export const App = ({ rootStore = RootStore.create() }: AppProps) => {
  return (
    <StoreProvider value={rootStore}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Root />
      </SafeAreaProvider>
    </StoreProvider>
  )
}
