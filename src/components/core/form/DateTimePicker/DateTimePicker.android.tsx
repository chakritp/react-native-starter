import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'

export const PlatformDateTimePicker = ({
  defaultValue,
  value,
  open,
  close,
  onChange,
  ...props
}) => {
  if (open) {
    return (
      <DateTimePicker
        value={value || defaultValue}
        onChange={(_ev, value) => {
          onChange(value)
          close()
        }}
        {...props} />
    )
  }

  return null
}
