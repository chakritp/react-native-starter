// import { CompositeNavigationProp, NavigatorScreenParams } from '@react-navigation/native'
// import { StackNavigationProp } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack'

export type AuthNav = {
  Landing: undefined
  SignIn: undefined
  Verify: { code: string } | undefined
}

export type AuthScreenProps<T extends keyof AuthNav> = StackScreenProps<AuthNav, T>

export type MainNav = {
  Home: undefined
  History: undefined
  Updates: undefined
  Settings: undefined
}

export type SettingsNav = {
  MainMenu: undefined
}

export type SettingsScreenProps<T extends keyof SettingsNav> = StackScreenProps<SettingsNav, T>
