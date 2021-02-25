import { useMemo } from 'react'
import {
  BaseTheme,
  SafeVariants,
  color,
  opacity,
  spacing,
  typography,
  textShadow,
  visible,
  ColorProps,
  OpacityProps,
  SpacingProps,
  TextShadowProps,
  TypographyProps,
  VisibleProps,
  spacingShorthand,
  SpacingShorthandProps
} from '@shopify/restyle'

export type BaseTextProps<Theme extends BaseTheme> = ColorProps<Theme> &
  OpacityProps<Theme> &
  VisibleProps<Theme> &
  TypographyProps<Theme> &
  SpacingProps<Theme> &
  SpacingShorthandProps<Theme> &
  TextShadowProps<Theme>

export const baseTextRestyleFunctions = [
  color,
  opacity,
  visible,
  typography,
  spacing,
  spacingShorthand,
  textShadow
]

export const useVariant = <
  Theme extends BaseTheme,
  K1 extends keyof SafeVariants<Theme> = keyof SafeVariants<Theme>,
  K2 extends keyof Omit<Theme[K1], 'defaults'> = keyof Omit<Theme[K1], 'defaults'>
>(theme: Theme, themeKey: K1, variantName: K2) => {
  const variantObj = theme[themeKey]

  return useMemo<Theme[K1][K2] & Theme[K1]['defaults']>(() => {
    const variantProps = variantObj[variantName]
    return variantObj.defaults
      ? { ...variantObj.defaults, ...variantProps }
      : variantProps
  }, [variantObj, variantName])
}
