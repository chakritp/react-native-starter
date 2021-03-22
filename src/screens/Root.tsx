import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Modal } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer, NavigationState } from '@react-navigation/native'
import { ThemeProvider } from '@shopify/restyle'
import { observer } from 'mobx-react-lite'
import { useStore, mergeSnapshot, useMSTFastRefresh } from 'lib/mst'
import { Toast, PartialNavigationState, createStackNavigator } from 'components/core'
import { AppUpgradeRequiredNotice } from 'components/AppUpgradeRequiredNotice'
import { rootNavigation } from 'services'
import { IRootStoreSnapshotIn } from 'stores'
import { defaultTheme, createNavigationTheme } from 'theme'
import { Auth } from './Auth'
import { Main } from './Main'

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
    let dispose

    const init = async () => {
      console.log('\n\n\n\nInitializing root store...\n')

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

    return dispose
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
          <Stack.Navigator>
            {authenticated ? (
              <Stack.Screen name="Main" component={Main} options={{
                headerShown: false
              }} />
            ) : (
              <Stack.Screen name="Auth" component={Auth} options={{
                headerShown: false
              }} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}

      {upgradeRequired && (
        <Modal animationType="slide" visible>
          <AppUpgradeRequiredNotice />
        </Modal>
      )}

      <Toast />
    </ThemeProvider>
  )
})
