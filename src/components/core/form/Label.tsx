import React, { isValidElement } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Text } from '../Text'

export function Label({ style, textStyle, inline, disabled, children, onPress, ...props }) {
  const styles = useStyles(themedStyles)
  const containerStyle = [
    styles.labelContainer,
    inline && styles.labelContainerInline,
    disabled && styles.disabled,
    style
  ]
  const content = isValidElement(children) ? children : (
    <Text
      style={[
        styles.labelText,
        inline && styles.labelTextInline,
        textStyle
      ]}
      color="label"
      {...props}>
      {children}
    </Text>
  )

  if (!disabled && onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        activeOpacity={disabled ? 1 : 0.8}
        onPress={onPress}
        {...props}>
        {content}
      </TouchableOpacity>
    )
  }

  return <View style={containerStyle} {...props}>{content}</View>
}

const themedStyles = createThemedStyleSheet(theme => ({
  labelContainer: {
    flexDirection: 'row',
    width: 'auto',
    marginRight: theme.spacing.m
  },
  labelContainerInline: {
    width: 120,
  },
  labelText: {
    ...theme.fonts.bodyMedium,
    marginBottom: theme.spacing.s,
    fontSize: theme.fontSizes.s
  },
  labelTextInline: {
    ...theme.fonts.bodyRegular,
    marginBottom: 0
  }
}))
