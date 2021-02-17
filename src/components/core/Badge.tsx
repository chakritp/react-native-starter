import React, { isValidElement, ReactNode } from 'react'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { ThemeColor, ThemeSize, createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { Text } from './Text'

export interface BadgeProps {
  style?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>
  color?: ThemeColor | string
  textColor?: ThemeColor | string
  size?: ThemeSize | number
  children?: ReactNode
}

export const Badge = ({
  style,
  textStyle,
  color,
  textColor = 'textInverse',
  size: _size = 's',
  children
} : BadgeProps) => {
  const theme = useTheme()
  const styles = useStyles(themedStyles)
  const size = typeof _size === 'string' ? theme.fontSizes[_size] : _size 
  const height = Math.round(size * (children ? 1.5 : 0.65))

  return (
    <View style={[
      styles.container,
      {
        height,
        minWidth: height,
        borderRadius: height / 2,
        paddingHorizontal: children ? height / 4 : 0,
        backgroundColor: theme.colors[color as ThemeColor] || color
      },
      style
    ]}>
      {!isValidElement(children) ? (
        <Text
          style={[
            styles.text,
            { fontSize: typeof size === 'string' ? theme.fontSizes[size] : size },
            textStyle
          ]}
          color={textColor}>
          {children}
        </Text>
      ) : children}
    </View>
  )
}

Badge.defaultProps = {
  size: 's',
  color: 'textMuted'
}

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    ...theme.fonts.bodyMedium
  }
}))
