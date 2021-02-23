import noop from 'lodash/noop'
import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { DateTimePickerBaseProps } from './common'

export default function PlatformDateTimePicker({
  defaultValue,
  value,
  open,
  onClose = noop,
  onChange = noop,
  ...props
}: DateTimePickerBaseProps) {
  if (open) {
    return (
      <DateTimePicker
        value={value || defaultValue}
        onChange={(_ev, value) => {
          onChange(value)
          onClose()
        }}
        {...props} />
    )
  }

  return null
}
