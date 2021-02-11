import React from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { createStackNavigator as $createStackNavigator } from '@react-navigation/stack'
import { createThemedStyleSheet, useStyles } from 'theme'
import { HeaderButton } from 'components/core'

export const createStackNavigator = (...args) => {
  const Stack = $createStackNavigator(...args)
  const { Navigator: StackNavigator } = Stack

  const Navigator = ({ screenOptions = {}, ...props }) => {
    const styles = useStyles(themedStyles)
    const { headerStyle, headerTitleStyle, cardStyle, ...options } = screenOptions

    return (
      <StackNavigator
        screenOptions={{
          headerStyle: [styles.header, headerStyle],
          headerTitleStyle: [styles.headerTitle, headerTitleStyle],
          cardStyle: [styles.card, cardStyle],
          headerBackTitleVisible: false,
          headerTitle: undefined,
          ...options
        }}
        {...props} />
    )
  }

  Stack.Navigator = Navigator
  return Stack
}

export const SettingsHeaderButton = () => {
  const navigation = useNavigation()

  return (
    <HeaderButton
      contentStyle={{ paddingHorizontal: 10 }}
      icon={{ name: 'settings', size: 28 }}
      onPress={() => navigation.navigate('Settings')} />
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  header: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: theme.colors.navBorder,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerTitle: {
    ...theme.fonts.headingMedium,
    fontSize: theme.fontSizes.m
  },
  card: {
    backgroundColor: theme.colors.containerBg
  }
}))
