import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Box, Icon, IconProps, Badge } from 'components/core'
import { t } from 'helpers/i18n'
import { Home } from './Home'
import { History } from './History'
import { Updates } from './Updates'
import { Settings } from './Settings'

const Tab = createBottomTabNavigator()

export const Main = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused: _, color, size }) => {
          const props: TabBarIconProps = { name: 'unknown', size, style: { color } }

          switch (route.name) {
            case 'Home':
              props.name = 'home'
              break
            case 'History':
              props.name = 'list-alt'
              break
            case 'Updates':
              props.badgeCount = 1
              props.name = 'notifications'
              break
            case 'Settings':
              props.name = 'settings'
              break
          }

          return <TabBarIcon {...props} />
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{
        title: t('screens.home.title')
      }} />
      <Tab.Screen name="History" component={History} options={{
        title: t('screens.history.title')
      }} />
      <Tab.Screen name="Updates" component={Updates} options={{
        title: t('screens.updates.title')
      }} />
      <Tab.Screen name="Settings" component={Settings} options={{
        title: t('screens.settings.title')
      }} />
    </Tab.Navigator>
  )
}

interface TabBarIconProps extends IconProps {
  badgeCount?: number
}

const TabBarIcon = ({ badgeCount, ...iconProps }: TabBarIconProps) => {
  return (
    <>
      <Icon {...iconProps} />
      {badgeCount && (
        <Box position="absolute" top={5}>
          <Badge size="xxxs" color="navNotification" ml="l">
            {`${badgeCount}`}
          </Badge>
        </Box>
      )}
    </>
  )
}
