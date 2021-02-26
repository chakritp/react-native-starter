import React, { ComponentPropsWithRef } from 'react'
import { StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import {
  StackNavigationOptions as $StackNavigationOptions,
  createStackNavigator as $createStackNavigator
} from '@react-navigation/stack'
import { boxRestyleFunctions, BoxProps, useRestyle, useTheme } from '@shopify/restyle'
import { Theme } from 'theme'
import { HeaderButton, TextProps, textRestyleFunctions } from 'components/core'

export interface StackNavigationOptions extends $StackNavigationOptions {
  headerStyleProps?: BoxProps<Theme>
  headerTitleStyleProps?: TextProps
  cardStyleProps?: BoxProps<Theme>
}

export const createStackNavigator = () => {
  const { Navigator: StackNavigator, Screen } = $createStackNavigator()

  type Props = Omit<ComponentPropsWithRef<typeof StackNavigator>, 'screenOptions'> & {
    screenOptions?: StackNavigationOptions
  }

  const Navigator = ({ screenOptions = {}, ...props }: Props) => {
    const theme = useTheme<Theme>()

    const {
      headerStyleProps,
      headerTitleStyleProps,
      cardStyleProps,
      headerStyle,
      headerTitleStyle,
      cardStyle,
      ...options
    } = screenOptions

    const defaultHeaderTitleStyleProps = {
      ...theme.fonts.headingMedium,
      fontSize: theme.fontSizes.m
    }

    const { style: baseHeaderStyle } = useRestyle(boxRestyleFunctions, {
      ...defaultHeaderStyleProps,
      ...headerStyleProps
    }) as any

    const { style: baseHeaderTitleStyle } = useRestyle(textRestyleFunctions, {
      ...defaultHeaderTitleStyleProps,
      ...headerTitleStyleProps
    }) as any

    const { style: baseCardStyle } = useRestyle(boxRestyleFunctions, {
      ...defaultCardStyleProps,
      ...cardStyleProps
    }) as any
    console.log(baseHeaderStyle)
    return (
      <StackNavigator
        screenOptions={{
          headerStyle: [baseHeaderStyle, headerStyle],
          headerTitleStyle: [baseHeaderTitleStyle, headerTitleStyle],
          cardStyle: [baseCardStyle, cardStyle],
          headerBackTitleVisible: false,
          headerTitle: undefined,
          ...options
        }}
        {...props} />
    )
  }

  return { Navigator, Screen }
}

const defaultHeaderStyleProps: BoxProps<Theme> = {
  elevation: 0,
  shadowOpacity: 0,
  borderBottomColor: 'mainBorderMuted',
  borderBottomWidth: StyleSheet.hairlineWidth
}

const defaultCardStyleProps: BoxProps<Theme> = {
  backgroundColor: 'mainBackgroundRegular'
}

export const SettingsHeaderButton = () => {
  const navigation = useNavigation()

  return (
    <HeaderButton
      paddingHorizontal="m"
      icon={{ name: 'settings', size: 28 }}
      onPress={() => navigation.navigate('Settings')} />
  )
}
