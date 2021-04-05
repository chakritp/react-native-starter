import debounce from 'lodash/debounce'
import React, { forwardRef, useMemo, useRef, useCallback } from 'react'
import { NativeMethods } from 'react-native'
import { IconButton } from '../IconButton'
import { TextInput, TextInputProps } from './TextInput'
import { t } from 'helpers/i18n'

export interface AutocompleteInputProps extends TextInputProps {
  submitDelay?: number
  onSubmit?: (value: string) => void
}

export interface AutocompleteInputMethods {
  focus: () => void
  blur: () => void
  cancel: () => void
}

export const AutocompleteInput = forwardRef<NativeMethods, TextInputProps>(({
  submitDelay = 300,
  value,
  accessibilityLabel,
  onChangeText,
  onSubmit,
  ...props
}: AutocompleteInputProps, ref: any) => {
  const inputRef = useRef<NativeMethods | null>(null)
  const submittedValueRef = useRef('')
  const onSubmitRef = useRef(onSubmit)

  onSubmitRef.current = onSubmit

  const submit = useCallback((value: string) => {
    value = value.trim()

    if (value !== submittedValueRef.current) {
      submittedValueRef.current = value
      onSubmitRef.current?.(value)
    }
  }, [])

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

  const controller: AutocompleteInputMethods = useMemo(() =>({
    cancel: () => {
      debouncedSubmit.cancel()
    },
    focus: () => {
      inputRef.current?.focus()
    },
    blur: () => {
      inputRef.current?.blur()
    }
  }), [debouncedSubmit])

  return (
    <TextInput
      ref={el => {
        inputRef.current = el
        if (ref) {
          if (typeof ref === 'function') {
            ref(controller)
          } else {
            ref.current = controller
          }
        }
      }}
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
