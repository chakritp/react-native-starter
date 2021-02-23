import React from 'react'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { PickerBase, PlatformPickerProps } from './common'

const PLACEHOLDER_VALUE = '@@Picker.PLACEHOLDER_VALUE'

export default function PickerAndroid({
  style,
  items,
  placeholder,
  selectedItem,
  onValueChange = () => {},
  ...props
}: PlatformPickerProps) {
  const styles = useStyles(themedStyles)
  const theme = useTheme()
  
  if (!selectedItem) {
    items = [{ label: placeholder || '', value: PLACEHOLDER_VALUE }, ...items]
  }

  return (
    <PickerBase
      style={[styles.container, style]}
      dropdownIconColor={theme.colors.inputText}
      items={items}
      onValueChange={(value, index) => value !== PLACEHOLDER_VALUE && onValueChange(value, index)}
      {...props} />
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    height: theme.sizes.m,
    color: theme.colors.inputText
  }
}))
