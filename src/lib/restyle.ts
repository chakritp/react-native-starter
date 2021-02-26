import { useMemo } from 'react'
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native'
import {
  BaseTheme,
  SafeVariants,
  useTheme,
} from '@shopify/restyle'

export function useVariant<
  Theme extends BaseTheme,
  K1 extends keyof SafeVariants<Theme> = keyof SafeVariants<Theme>,
  K2 extends keyof Omit<Theme[K1], 'defaults'> = keyof Omit<Theme[K1], 'defaults'>
>(theme: Theme, themeKey: K1, variantName: K2) {
  const variantObj = theme[themeKey]

  return useMemo<Theme[K1][K2] & Theme[K1]['defaults']>(() => {
    const variantProps = variantObj[variantName]
    return variantObj.defaults
      ? { ...variantObj.defaults, ...variantProps }
      : variantProps
  }, [variantObj, variantName])
}

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }
type ThemedStylesFactory<T extends {}> = (theme: any) => NamedStyles<T>
type ThemedStyles<T extends {}> = (theme: any) => NamedStyles<T>

export function createThemedStyles<T>(factory: ThemedStylesFactory<T>) {
  let currentTheme: BaseTheme
  let currentStyleSheet: NamedStyles<T>

  return function getThemedStyleSheet(theme: BaseTheme) {
    if (theme === currentTheme) {
      return currentStyleSheet
    }
    currentTheme = theme
    currentStyleSheet = StyleSheet.create(factory(theme))
    return currentStyleSheet
  }
}

export function useThemedStyles<T>(themedStyles: ThemedStyles<T>) {
  const theme = useTheme()
  return themedStyles(theme)
}
