import React, { ComponentProps, ComponentPropsWithRef, ReactNode } from 'react'
import { Text as $Text } from 'react-native'
import {
  layout,
  position,
  LayoutProps,
  PositionProps,
  TextProps as $TextProps,
  textRestyleFunctions,
  createRestyleComponent,
  useTheme
} from '@shopify/restyle'
import { Theme } from 'theme'

type Props = ComponentProps<typeof $Text> & { children?: ReactNode }

type BaseTextProps = $TextProps<Theme, true> & LayoutProps<Theme> & PositionProps<Theme>

const restyleFunctions = [
  ...textRestyleFunctions,
  layout,
  position
]

const BaseText = createRestyleComponent<
  BaseTextProps & Omit<Props, keyof BaseTextProps>,
  Theme
>(
  restyleFunctions as [],
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
