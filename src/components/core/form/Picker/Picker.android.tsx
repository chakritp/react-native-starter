import React from 'react'
import { useTheme } from '@shopify/restyle'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { Theme } from 'theme'
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
  const styles = useThemedStyles(themedStyles)
  const theme = useTheme<Theme>()
  
  if (!selectedItem) {
    items = [{ label: placeholder || '', value: PLACEHOLDER_VALUE }, ...items]
  }

  return (
    <PickerBase
      style={[styles.container, style]}
      dropdownIconColor={theme.colors.mainForegroundRegular}
      items={items}
      onValueChange={(value, index) => value !== PLACEHOLDER_VALUE && onValueChange(value, index)}
      {...props} />
  )
}

const themedStyles = createThemedStyles((theme: Theme) => ({
  container: {
    height: theme.sizes.m,
    color: theme.colors.mainForegroundRegular
  }
}))
