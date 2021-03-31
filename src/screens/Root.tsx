import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer, NavigationState } from '@react-navigation/native'
import { StackCardStyleInterpolator } from '@react-navigation/stack'
import { ThemeProvider } from '@shopify/restyle'
import { observer } from 'mobx-react-lite'
import { useStore, mergeSnapshot, useMSTFastRefresh } from 'lib/mst'
import { Toast, PartialNavigationState, createStackNavigator } from 'components/core'
import { rootNavigation } from 'services'
import { IRootStoreSnapshotIn } from 'stores'
import { defaultTheme, createNavigationTheme } from 'theme'
import { Auth } from './Auth'
import { Main } from './Main'
import { AppUpgradeRequired } from './AppUpgradeRequired'

const Stack = createStackNavigator()

export interface RootProps {
  snapshot?: IRootStoreSnapshotIn,
  initialNavigationState?: PartialNavigationState
}

export const Root = observer(({ snapshot, initialNavigationState }: RootProps) => {
  const theme = defaultTheme
  const navigationTheme = useMemo(() => createNavigationTheme(theme), [theme])
  const [initialized, setInitialized] = useState(false)
  const rootStore = useStore()

  if (__DEV__) {
    useMSTFastRefresh(rootStore)
  }

  const {
    appStore: { navigationReady, upgradeRequired, start },
    authStore: { authenticated }
  } = rootStore

  useLayoutEffect(() => {
    let dispose: () => void

    const init = async () => {
      if (__DEV__ && !global.test) console.log('\n\n\n\nInitializing root store...\n')
      
      if (!initialized) {
        try {
          await rootStore.loadStoredState()
          if (snapshot) {
            mergeSnapshot(rootStore, snapshot)
          }
        } catch (error) {
          console.warn(error)
        }
  
        SplashScreen.hide()
      }

      dispose = rootStore.initialize()
      setInitialized(true)
    }

    init()
    return () => dispose?.()
  }, [rootStore])

  useEffect(() => {
    if (initialized) {
      start()
    }
  }, [initialized])
  
  const onNavigationStateChange = useCallback((navState?: NavigationState) => {
    if (navState) {
      Toast.handleNavigationStateChange(navState)
      // TODO: Send screen change analytics event.
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      {navigationReady && (
        <NavigationContainer
          ref={nav => rootNavigation.setNavigator(nav)} 
          theme={navigationTheme}
          initialState={initialNavigationState} 
          onStateChange={onNavigationStateChange}
        >
          <Stack.Navigator screenOptions={{
            headerShown: false,
            cardStyleInterpolator: forFade
          }}>
            {upgradeRequired ? (
              <Stack.Screen name="AppUpgradeRequired" component={AppUpgradeRequired} />
            ) : authenticated ? (
              <Stack.Screen name="Main" component={Main} />
            ) : (
              <Stack.Screen name="Auth" component={Auth} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}

      <Toast />
    </ThemeProvider>
  )
})

const forFade: StackCardStyleInterpolator = ({ current }) => ({
  cardStyle: {
    opacity: current.progress
  }
})
