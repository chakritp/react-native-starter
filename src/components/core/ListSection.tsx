import React from 'react'
import { View, StyleSheet } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Text } from './Text'

export const ListSection = ({ style, title, titleStyle, topSpacing, bottomSpacing, children }) => {
  const styles = useStyles(themedStyles)
  return (
    <View style={[
      topSpacing && styles.topSpacing,
      bottomSpacing && styles.bottomSpacing,
      style
    ]}>
      {title && <Text.P4 style={[styles.title, titleStyle]}>{title}</Text.P4>}
      <View style={[styles.listContainer]}>
        {children}
      </View>
    </View>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  listContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.borderLight
  },
  title: {
    marginTop: theme.spacing.l,
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.l,
    color: theme.colors.textMuted,
    textTransform: 'uppercase'
  },
  topSpacing: {
    marginTop: theme.spacing.l
  },
  bottomSpacing: {
    marginBottom: theme.spacing.l
  }
}))
