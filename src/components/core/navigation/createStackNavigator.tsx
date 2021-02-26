import React from 'react'
import { StyleSheet } from 'react-native'
import {
  StackNavigationOptions,
  createStackNavigator as $createStackNavigator
} from '@react-navigation/stack'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { Theme } from 'theme'

export const createStackNavigator = () => {
  const Stack = $createStackNavigator()
  const { Navigator: StackNavigator } = Stack

  const Navigator: typeof StackNavigator = ({ screenOptions = {}, ...props }) => {
    const styles = useThemedStyles(themedStyles)

    const {
      headerStyle,
      headerTitleStyle,
      cardStyle,
      ...options
    } = screenOptions as StackNavigationOptions

    return (
      <StackNavigator
        screenOptions={{
          headerStyle: [styles.header, headerStyle],
          headerTitleStyle: [styles.headerTitle, headerTitleStyle],
          cardStyle: [styles.card, cardStyle],
          headerBackTitleVisible: false,
          headerTitle: '',
          ...options
        }}
        {...props} />
    )
  }

  Stack.Navigator = Navigator
  return Stack
}

const themedStyles = createThemedStyles((theme: Theme) => ({
  header: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomColor: theme.colors.navBorderRegular,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  headerTitle: {
    ...theme.fonts.headingMedium,
    fontSize: theme.fontSizes.m
  },
  card: {
    backgroundColor: theme.colors.mainBackgroundRegular
  }
}))
