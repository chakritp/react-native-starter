import React, { forwardRef } from 'react'
import { NativeMethods } from 'react-native'
import { FormattedTextInput, BaseFormattedTextInputProps } from 'components/core'

export type USPhoneNumberInputProps<T = string> = BaseFormattedTextInputProps<T>

/**
 * Supports US mobile phone numbers only
 */
export const USPhoneNumberInput = forwardRef<NativeMethods, USPhoneNumberInputProps>((props: USPhoneNumberInputProps, ref: any) => {
  return (
    <FormattedTextInput<string>
      ref={ref}
      keyboardType="number-pad"
      dataDetectorTypes="phoneNumber"
      textContentType="telephoneNumber"
      parse={parse}
      format={format}
      {...props} />
  )
})

function parse(text: string) {
  return '+1' + text.replace(/\D/g, '')
}

function format(value: string) {
  if (value[0] === '+') {
    value = value.slice(2)
  }
  if (value.length <= 3) return value
  if (value.length <= 6) {
    return `(${value.slice(0, 3)}) ${value.slice(3)}`
  }
  return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
}
