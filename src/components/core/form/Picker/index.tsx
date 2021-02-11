import React, { useMemo } from 'react'
import { View } from 'react-native'
import PlatformPicker from './Picker'
import { createThemedStyleSheet, useStyles } from 'theme'
import { InputContainer } from '../common'

export const Picker = ({
  style,
  inputStyle,
  itemStyle,
  labelStyle,
  labelTextStyle,
  inline,
  label,
  items = [],
  value,
  disabled,
  onChange,
  ...props
}) => {
  const styles = useStyles(themedStyles)
  const selectedItem = useMemo(() => {
    return items.find(item => item.value === value)
  }, [items, value])

  return (
    <InputContainer
      style={style}
      labelStyle={labelStyle}
      labelTextStyle={labelTextStyle}
      inline={inline}
      label={label}
      disabled={disabled}>

      <View style={[styles.input, inputStyle]}>
        <PlatformPicker
          inline={inline}
          items={items}
          selectedItem={selectedItem}
          selectedValue={value}
          itemStyle={[styles.item, itemStyle]}
          disabled={disabled}
          accessible
          accessibilityRole="spinbutton"
          accessibilityLabel={typeof label === 'string' ? label : undefined}
          onValueChange={onChange}
          {...props} />
      </View>
    </InputContainer>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  input: {
    justifyContent: 'center',
    backgroundColor: theme.colors.inputBg,
    borderRadius: theme.radii.m
  },
  item: {
    ...theme.fonts.bodyRegular,
    color: theme.colors.text
  }
}))
