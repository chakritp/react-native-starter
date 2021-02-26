import _defaultTheme from './default'
import _darkTheme from './dark'
export { default as palette } from './palette'

export type Theme = typeof _defaultTheme
export type ThemeColor = keyof typeof _defaultTheme.colors
export type ThemeSize = keyof typeof _defaultTheme.sizes
export type ThemeSpacing = keyof typeof _defaultTheme.spacing

export const defaultTheme = _defaultTheme as Theme
export const darkTheme = _darkTheme as Theme
