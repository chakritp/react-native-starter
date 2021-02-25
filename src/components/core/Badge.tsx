import React, { isValidElement, ReactNode } from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme, ThemeSize } from 'theme'
import { Box, BoxProps } from './common'
import { Text, TextProps } from './Text'

export interface BadgeProps extends BoxProps {
  style?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>
  color?: TextProps['color']
  textColor?: TextProps['color']
  size?: ThemeSize | number
  children?: string | ReactNode
}

export const Badge = ({
  style,
  textStyle,
  color,
  textColor = 'white',
  size: _size = 's',
  children,
  ...props
} : BadgeProps) => {
  const theme = useTheme<Theme>()
  const size = typeof _size === 'string' ? theme.fontSizes[_size] : _size 
  const height = Math.round(size * (children ? 1.5 : 0.65))

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      backgroundColor={color}
      style={[
        {
          height,
          minWidth: height,
          borderRadius: height / 2,
          paddingHorizontal: children ? height / 4 : 0
        },
        style
      ]}
      {...props}
    >
      {!isValidElement(children) ? (
        <Text
          font="bodyMedium"
          style={[
            { fontSize: typeof size === 'string' ? theme.fontSizes[size] : size },
            textStyle
          ]}
          color={textColor}>
          {children}
        </Text>
      ) : children}
    </Box>
  )
}

Badge.defaultProps = {
  size: 's',
  color: 'textMuted'
}
