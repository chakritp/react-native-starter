import React, { useMemo } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import PlatformPicker from './Picker'
import { createThemedStyleSheet, useStyles } from 'theme'
import { PlatformPickerProps, PickerItem as _PickerItem } from './common'

export type PickerItem = _PickerItem

export interface PickerProps extends Omit<PlatformPickerProps, 'items'> {
  style?: StyleProp<ViewStyle>
  items?: _PickerItem[]
  value?: number | string | null
  onChange?: PlatformPickerProps['onValueChange']
}

export const Picker = ({
  style,
  itemStyle,
  embedded,
  items = [],
  value,
  disabled,
  onChange,
  ...props
}: PickerProps) => {
  const styles = useStyles(themedStyles)
  const selectedItem = useMemo(() => {
    return items.find(item => item.value === value)
  }, [items, value])

  return (
    <View style={[styles.container, embedded && styles.embedded, style]}>
      <PlatformPicker
        embedded={embedded}
        items={items}
        selectedItem={selectedItem}
        selectedValue={value || undefined}
        itemStyle={[styles.item, itemStyle]}
        disabled={disabled}
        accessible
        accessibilityRole="spinbutton"
        onValueChange={onChange}
        {...props} />
    </View>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.inputBg,
    borderRadius: theme.radii.m
  },
  embedded: {
    backgroundColor: 'transparent'
  },
  item: {
    ...theme.fonts.bodyRegular,
    color: theme.colors.text
  }
}))
