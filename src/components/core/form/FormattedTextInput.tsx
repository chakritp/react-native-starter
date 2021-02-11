import React, { forwardRef, useCallback, useMemo } from 'react'
import { TextInput as RNTextInput, StyleSheet } from 'react-native'
import { TextInput } from './TextInput'

export const FormattedTextInput = forwardRef(({
  format = value => String(value),
  parse = text => text,
  value,
  onChange = () => {},
  ...props
}, ref) => {
  const formattedValue = useMemo(() => format(value), [value, format])

  const onChangeText = useCallback(text => {
    onChange(parse(text))
  }, [onChange, parse])

  return (
    <TextInput
      ref={ref}
      Input={Input}
      value={formattedValue}
      onChangeText={onChangeText}
      {...props} />
  )
})

const Input = forwardRef(({ style, value, ...props }, ref) => (
  <>
    <RNTextInput
      style={[style]}
      pointerEvents="none"
      numberOfLines={1}
      editable={false}
      value={value != null ? value : ''} />
    <RNTextInput
      ref={ref}
      style={[style, styles.input]}
      numberOfLines={1}
      value={value != null ? value : ''}
      {...props} />
  </>
))

const styles = StyleSheet.create({
  input: {
    ...StyleSheet.absoluteFillObject,
    color: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'transparent'
  }
})
