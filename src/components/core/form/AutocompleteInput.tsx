import debounce from 'lodash/debounce'
import noop from 'lodash/noop'
import React, { forwardRef, useRef, useCallback } from 'react'
import { TextInput as $TextInput } from 'react-native'
import { TextInput, TextInputProps } from './TextInput'

export interface AutocompleteInputProps extends TextInputProps {
  submitDelay?: number
  onSubmit?: (value: string) => void
}

export const AutocompleteInput = forwardRef<typeof $TextInput, TextInputProps>(({
  submitDelay,
  value,
  onChangeText = noop,
  onSubmit = noop,
  ...props
}: AutocompleteInputProps, ref: any) => {
  const submittedValueRef = useRef('')

  const submit = useCallback((value: string) => {
    value = value.trim()

    if (value !== submittedValueRef.current) {
      submittedValueRef.current = value
      onSubmit(value)
    }
  }, [onSubmit])

  const debouncedSubmit = useCallback(debounce(submit, submitDelay), [submit, submitDelay])

  const onChange = useCallback((value: string) => {
    value = value.trimLeft()
    onChangeText(value)
    debouncedSubmit(value)
  }, [debouncedSubmit, onChangeText])

  const onClear = useCallback(() => {
    debouncedSubmit.cancel()
    onChangeText('')
    submit('')
  }, [debouncedSubmit, submit, onChangeText])

  return (
    <TextInput
      ref={ref}
      rightIcon={value !== '' && {
        name: 'clear',
        size: 's',
        color: 'textMuted',
        onPress: onClear
      }}
      accessibilityRole="search"
      autoCapitalize="none"
      autoCompleteType="off"
      autoCorrect={false}
      returnKeyType="search"
      value={value}
      onChangeText={onChange}
      {...props} />
  )
})
