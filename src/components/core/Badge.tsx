import React, { isValidElement } from 'react'
import { View } from 'react-native'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { Text } from './Text'

export const Badge = ({
  style,
  textStyle,
  color,
  textColor = 'textInverse',
  size,
  children
}) => {
  const theme = useTheme()
  const styles = useStyles(themedStyles)
  const height = Math.round(theme.fontSizes[size] * (children ? 1.5 : 0.65))

  return (
    <View style={[
      styles.container,
      {
        height,
        minWidth: height,
        borderRadius: height / 2,
        paddingHorizontal: children ? height / 4 : 0,
        backgroundColor: theme.colors[color] || color
      },
      style
    ]}>
      {!isValidElement(children) ? (
        <Text
          style={[
            styles.text,
            { fontSize: theme.fontSizes[size] },
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
