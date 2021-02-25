import _defaultTheme from './default'
import _darkTheme from './dark'
export { default as palette } from './palette'

export type Theme = typeof _defaultTheme
export type ThemeSize = keyof typeof _defaultTheme.sizes

export const defaultTheme = _defaultTheme as Theme
export const darkTheme = _darkTheme as Theme
