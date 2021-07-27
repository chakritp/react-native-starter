import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { DateTimePickerBaseProps } from './common'

export default function PlatformDateTimePicker({
  defaultValue,
  value,
  open,
  onClose,
  onChange,
  ...props
}: DateTimePickerBaseProps) {
  if (open) {
    return (
      <DateTimePicker
        value={value || defaultValue}
        onChange={(_ev: any, value?: Date) => {
          // onClose() must be called before onChange() to prevent double-display bug.
          if (open) {
            onClose?.()
          }
          if (value) {
            onChange?.(value)
          }
        }}
        {...props} />
    )
  }

  return null
}
