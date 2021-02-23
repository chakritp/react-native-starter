import React, { isValidElement, ReactNode } from 'react'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Text, TextProps } from '../Text'

export interface LabelProps extends TextProps {
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  inline?: boolean
  children?: ReactNode
}

export function Label({ style, textStyle, inline, children, ...textProps }: LabelProps) {
  const styles = useStyles(themedStyles)

  return (
    <View style={[styles.container, style]}>
      {isValidElement(children) ? children : (
        <Text
          style={[
            styles.text,
            inline && styles.textInline,
            textStyle
          ]}
          color="label"
          {...textProps}
        >
          {children}
        </Text>
      )}
    </View>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    flexDirection: 'row',
    width: 'auto',
    marginRight: theme.spacing.m
  },
  text: {
    ...theme.fonts.bodyMedium,
    marginBottom: theme.spacing.s,
    fontSize: theme.fontSizes.s
  },
  textInline: {
    marginBottom: 0
  }
}))
