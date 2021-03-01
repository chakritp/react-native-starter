import React from 'react'
import { createStackNavigator } from 'components/core'
import { t } from 'helpers/i18n'
import { MainMenu } from './MainMenu'

const Stack = createStackNavigator()

export const Settings = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainMenu" component={MainMenu} options={{
        headerTitle: t('screens.settings.title')
      }} />
    </Stack.Navigator>
  )
}
