import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { observer } from 'mobx-react-lite'
import { useStore } from 'lib/mst'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { Icon, IconProps } from 'components/core'
import { t } from 'helpers/i18n'
import { Theme } from 'theme'
import { Home } from './Home'
import { History } from './History'
import { Updates } from './Updates'
import { Settings } from './Settings'

const Tab = createBottomTabNavigator()

export const Main = observer(() => {
  const styles = useThemedStyles(themedStyles)
  const {
    authStore: { authenticated },
    reset
  } = useStore()

  useEffect(() => {
    // Reset root store state when unmounted after auth is revoked.
    return () => {
      if (!authenticated) {
        reset()
      }
    }
  }, [authenticated])
  
  return (
    <Tab.Navigator
      tabBarOptions={{
        labelStyle: styles.tabBarLabel
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const props: IconProps = { name: 'unknown', size, style: { color } }

          switch (route.name) {
            case 'Home':
              props.name = 'home'
              break
            case 'History':
              props.name = 'list-alt'
              break
            case 'Updates':
              props.name = 'notifications'
              break
            case 'Settings':
              props.name = 'settings'
              break
          }

          return <Icon {...props} />
        },
        tabBarBadgeStyle: styles.tabBarBadge
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{
        title: t('screens.home.title')
      }} />
      <Tab.Screen name="History" component={History} options={{
        title: t('screens.history.title'),
      }} />
      <Tab.Screen name="Updates" component={Updates} options={{
        title: t('screens.updates.title'),
        tabBarBadge: 99
      }} />
      <Tab.Screen name="Settings" component={Settings} options={{
        title: t('screens.settings.title')
      }} />
    </Tab.Navigator>
  )
})

const themedStyles = createThemedStyles((theme: Theme) => ({
  tabBarLabel: {
    ...theme.fonts.bodyRegular,
    fontSize: theme.fontSizes.xxxs,
    letterSpacing: 0.5
  },
  tabBarBadge: {
    height: 16,
    minWidth: 16,
    fontSize: theme.fontSizes.xxs,
    lineHeight: theme.fontSizes.xxs * 1.25,
    borderRadius: 8
  }
}))
