import React from 'react'
import { View, Switch as RNSwitch, StyleSheet } from 'react-native'
import { renderLabel } from './common'

export const Switch = ({
  style,
  inputStyle,
  labelStyle,
  labelTextStyle,
  label,
  disabled,
  value,
  onChange,
  ...props
}) => (
  <View style={[styles.container, style]}>
    {renderLabel(label, { style: labelStyle, textStyle: labelTextStyle, disabled })}

    <RNSwitch
      style={[styles.input, inputStyle]} 
      accessibile
      accessibilityRole="switch"
      accessibilityLabel={typeof label === 'string' ? label : undefined}
      disabled={disabled}
      value={value}
      onChange={() => onChange(!value)}
      {...props} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    marginLeft: 'auto'
  },
  disabled: {
    opacity: 0.6
  }
})
