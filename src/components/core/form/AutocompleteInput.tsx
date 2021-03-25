import debounce from 'lodash/debounce'
import React, { forwardRef, useRef, useCallback } from 'react'
import { TextInput as $TextInput } from 'react-native'
import { IconButton } from '../IconButton'
import { TextInput, TextInputProps } from './TextInput'
import { t } from 'helpers/i18n'

export interface AutocompleteInputProps extends TextInputProps {
  submitDelay?: number
  onSubmit?: (value: string) => void
}

export const AutocompleteInput = forwardRef<typeof $TextInput, TextInputProps>(({
  submitDelay,
  value,
  accessibilityLabel,
  onChangeText,
  onSubmit,
  ...props
}: AutocompleteInputProps, ref: any) => {
  const submittedValueRef = useRef('')

  const submit = useCallback((value: string) => {
    value = value.trim()

    if (value !== submittedValueRef.current) {
      submittedValueRef.current = value
      onSubmit?.(value)
    }
  }, [onSubmit])

  const debouncedSubmit = useCallback(debounce(submit, submitDelay), [submit, submitDelay])

  const onChange = useCallback((value: string) => {
    value = value.trimLeft()
    onChangeText?.(value)
    debouncedSubmit(value)
  }, [debouncedSubmit, onChangeText])

  const onClear = useCallback(() => {
    debouncedSubmit.cancel()
    onChangeText?.('')
    submit('')
  }, [debouncedSubmit, submit, onChangeText])

  return (
    <TextInput
      ref={ref}
      rightIcon={value !== '' ? (
        <IconButton
          name="clear"
          size="s"
          color="inputForegroundMuted"
          accessibilityLabel={accessibilityLabel ? t('clearInput', { label: accessibilityLabel }) : t('clear')}
          onPress={onClear} />
      ) : undefined}
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
