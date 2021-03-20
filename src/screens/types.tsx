import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native'
import { StackScreenProps, StackNavigationProp } from '@react-navigation/stack'

export type MainTabs = {
  Home: undefined
  History: undefined
  Updates: undefined
  Settings: undefined
}

export type AuthStack = {
  Landing: undefined
  SignIn: undefined
  VerifyCode: undefined
}

export type AuthScreenProps<T extends keyof AuthStack> = StackScreenProps<AuthStack, T>

export type SettingsStack = {
  MainMenu: undefined
}

export type SettingsScreenProps<T extends keyof SettingsStack> = StackScreenProps<SettingsStack, T>
