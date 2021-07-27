import React, { ComponentProps, ComponentPropsWithRef, ReactNode } from 'react'
import { Text as $Text } from 'react-native'
import {
  layout,
  position,
  LayoutProps,
  PositionProps,
  TextProps as $TextProps,
  textRestyleFunctions as $textRestyleFunctions,
  createRestyleComponent,
  useTheme
} from '@shopify/restyle'
import { Theme } from 'theme'

type Props = ComponentProps<typeof $Text> & { children?: ReactNode }

type BaseTextProps = $TextProps<Theme, true> & LayoutProps<Theme> & PositionProps<Theme>

export const textRestyleFunctions = [
  ...$textRestyleFunctions,
  layout,
  position
] as any[]

const BaseText = createRestyleComponent<
  BaseTextProps & Omit<Props, keyof BaseTextProps>,
  Theme
>(
  textRestyleFunctions as [],
  $Text,
)

export interface TextProps extends ComponentPropsWithRef<typeof BaseText> {
  font?: keyof Theme['fonts']
}

export const Text = ({
  font,
  ...props
}: TextProps) => {
  const theme = useTheme<Theme>()
  const fontProps = font ? theme.fonts[font] as any : undefined
  return <BaseText {...fontProps} {...props} />
}
