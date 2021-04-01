import React from 'react'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'
import { StoreProvider } from 'lib/mst'
import { PartialNavigationState } from 'components/core'
import { Root } from 'screens/Root'
import { IRootStore, RootStore } from 'stores'

export interface AppProps {
  rootStore?: IRootStore,
  initialNavState?: PartialNavigationState
}

export const App = ({ rootStore = RootStore.create(), initialNavState }: AppProps) => {
  return (
    <StoreProvider value={rootStore}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <Root initialNavState={initialNavState} />
      </SafeAreaProvider>
    </StoreProvider>
  )
}
