import React, { ComponentType, ReactNode, createContext, useContext, forwardRef } from 'react'
import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native'
import defaultTheme from './default'

export type Theme = typeof defaultTheme
export type ThemeColorKey = keyof Theme['colors']
export type ThemeFontKey = keyof Theme['fonts']
export type ThemeSizeKey = 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs'

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }
//  <T extends NamedStyles<T> | NamedStyles<any>>(styles: T | NamedStyles<T>

type ThemedStyleSheet<T extends {}> = (theme: Theme) => NamedStyles<T>

export function createThemedStyleSheet<T>(callback: ThemedStyleSheet<T>) {
  let currentTheme: Theme
  let currentStyleSheet: NamedStyles<T>

  return function getThemedStyleSheet(theme: Theme) {
    if (theme === currentTheme) {
      return currentStyleSheet
    }
    currentTheme = theme
    currentStyleSheet = StyleSheet.create(callback(theme))
    return currentStyleSheet
  }
}

export interface ThemeContextValue {
  theme?: Theme
  getStyles?: <T>(themedStyleSheet: ThemedStyleSheet<T>) => NamedStyles<T>,
}

export const ThemeContext = createContext<ThemeContextValue>({})

export function ThemeProvider({ theme, children }: { theme: Theme, children?: ReactNode }) {
  return (
    <ThemeContext.Provider value={{
      getStyles: themedStyleSheet => themedStyleSheet(theme),
      theme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext).theme!
}

export function useStyles<T>(themedStyleSheet: ThemedStyleSheet<T>) {
  return useContext(ThemeContext).getStyles!(themedStyleSheet)
}

export function withTheme(WrappedComponent: any) {
  const ThemedComponent = forwardRef((props, ref: any) => (
    <ThemeContext.Consumer>
      {context => {
        return <WrappedComponent ref={ref} {...context} {...props} />
      }}
    </ThemeContext.Consumer>
  ))

  return ThemedComponent
}

export function withThemeProvider(theme: Theme, WrappedComponent: ComponentType) {
  const ThemeProviderWrapper = (props: any) => (
    <ThemeProvider theme={theme}>
      <WrappedComponent {...props} />
    </ThemeProvider>
  )

  return ThemeProviderWrapper
}

export function createNavigationTheme(theme: Theme) {
  return {
    colors: {
      background: theme.colors.navBg,
      border: theme.colors.navBorder,
      card: theme.colors.containerBg,
      primary: theme.colors.navPrimary
    }
  }
}
