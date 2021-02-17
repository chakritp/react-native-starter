import React, { ReactNode } from 'react'
import { StyleProp, Text as RNText, TextProps as $TextProps, TextStyle } from 'react-native'
import { ThemeColor, ThemeFont, ThemeSize, useTheme } from 'theme'

export interface TextProps extends $TextProps {
  font?: ThemeFont | string
  size?: ThemeSize | number
  color?: ThemeColor | string
  align?: 'left' | 'center' | 'right'
  children?: ReactNode
}

const TextBase = ({ style, font, size, color, align, ...props }: TextProps) => {
  const theme = useTheme()
  const baseStyle: StyleProp<TextStyle> = {}

  if (font) {
    Object.assign(baseStyle, theme.fonts[font])
  }
  if (size) {
    baseStyle.fontSize = typeof size === 'string' ? theme.fontSizes[size] : size
  }
  if (color) {
    baseStyle.color = theme.colors[color as ThemeColor] || color
  }
  if (align) {
    baseStyle.textAlign = align
  }

  return (
    <RNText style={[baseStyle, style]} {...props} />
  )
}

export const Text = ({ font = 'bodyRegular', size = 's', color = 'text', ...props }: TextProps) => {
  return <TextBase font={font} size={size} color={color} {...props} />
}

const H1 = (props: TextProps) => (
  <Text font="headingMedium" size="xl" {...props} />
)

const H2 = (props: TextProps) => (
  <Text font="headingMedium" size="l" {...props} />
)

const H3 = (props: TextProps) => (
  <Text font="headingMedium" size="m" {...props} />
)

const H4 = (props: TextProps) => (
  <Text font="headingMedium" size="s"  {...props} />
)

const H5 = (props: TextProps) => (
  <Text font="headingMedium" size="xs"  {...props} />
)

const H6 = (props: TextProps) => (
  <Text font="headingMedium" size="xxs"  {...props} />
)

const S1 = (props: TextProps) => (
  <Text font="headingRegular" size="l"  {...props} />
)

const S2 = (props: TextProps) => (
  <Text font="headingRegular" size="m" {...props} />
)

const S3 = (props: TextProps) => (
  <Text font="headingRegular" size="s" {...props} />
)

const P1 = (props: TextProps) => (
  <Text size="l" {...props} />
)

const P2 = (props: TextProps) => (
  <Text size="m" {...props} />
)

const P3 = (props: TextProps) => (
  <Text size="s" {...props} />
)

const P4 = (props: TextProps) => (
  <Text size="xs" {...props} />
)

const C1 = (props: TextProps) => (
  <Text font="bodyLight" size="xs" {...props} />
)

const C2 = (props: TextProps) => (
  <Text font="bodyLight" size="xxs" {...props} />
)

Text.Nested = TextBase
Text.H1 = H1
Text.H2 = H2
Text.H3 = H3
Text.H4 = H4
Text.H5 = H5
Text.H6 = H6
Text.S1 = S1
Text.S2 = S2
Text.S3 = S3
Text.P1 = P1
Text.P2 = P2
Text.P3 = P3
Text.P4 = P4
Text.C1 = C1
Text.C2 = C2
