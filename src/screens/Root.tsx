import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Modal } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer, NavigationState } from '@react-navigation/native'
import { observer } from 'mobx-react-lite'
import { useStore, mergeSnapshot, useMSTFastRefresh } from 'lib/mst'
import { ThemeProvider } from 'theme'
import { Toast } from 'components/core'
import { createStackNavigator } from 'components/navigation'
import { AppUpgradeRequiredNotice } from 'components/AppUpgradeRequiredNotice'
import { api, rootNavigation } from 'services'
import { defaultTheme, darkTheme, createNavigationTheme } from 'theme'
// import { Auth } from './Auth'
// import { Main } from './Main'

const Stack = createStackNavigator()

export const Root = observer((props: {
  snapshot?: object,
  initialNavigationState?: NavigationState
}) => {
  const { snapshot, initialNavigationState } = props
  const theme = defaultTheme
  const navigationTheme = useMemo(() => createNavigationTheme(theme), [theme])
  const [initialized, setInitialized] = useState(false)
  const [appUpgradeRequired, setAppUpgradeRequired] = useState(false)
  const rootStore = useStore()

  if (__DEV__) {
    useMSTFastRefresh(rootStore)
  }
  
  const {
    appStore: { handleInitialDeepLink },
    authStore: { authenticated, revokeAuth }
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
      handleInitialDeepLink()
    }
  }, [initialized])
  
  useEffect(() => {
    const apiErrorListener = ({ error }: { error: any }) => {
      if (error.status == 401 && authenticated) {
        revokeAuth()
      } else if (error.code === 'app_upgrade_required') {
        setAppUpgradeRequired(true)
      }
    }

    api.client.on('error', apiErrorListener)
    return () => {
      api.client.off('error', apiErrorListener)
    }
  }, [authenticated])

  const onNavigationStateChange = useCallback((navState?: NavigationState) => {
    if (navState) {
      Toast.handleNavigationStateChange(navState)
      // TODO: Send screen change analytics event.
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      {initialized && (
        <NavigationContainer
          ref={nav => rootNavigation.setNavigator(nav)} 
          theme={navigationTheme}
          initialState={initialNavigationState} 
          onStateChange={onNavigationStateChange}>
          {/* <Stack.Navigator>
            {authenticated ? (
              <Stack.Screen name="Main" component={Main} options={{
                headerShown: false,
                cardStyle: { backgroundColor: darkTheme.colors.containerBg }
              }} />
            ) : (
              <Stack.Screen name="Auth" component={Auth} options={{
                headerShown: false,
                cardStyle: { backgroundColor: darkTheme.colors.containerBg }
              }} />
            )}
          </Stack.Navigator> */}
        </NavigationContainer>
      )}

      {appUpgradeRequired && (
        <Modal animationType="slide" visible>
          <AppUpgradeRequiredNotice />
        </Modal>
      )}

      <Toast />
    </ThemeProvider>
  )
})
