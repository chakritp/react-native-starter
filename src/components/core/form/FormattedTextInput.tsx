import React, {
  ComponentType,
  ComponentPropsWithRef,
  Ref,
  ReactElement,
  forwardRef,
  useCallback,
  useMemo
} from 'react'
import { TextInput as RNTextInput, StyleSheet, NativeMethods } from 'react-native'
import { TextInput, TextInputProps } from './TextInput'

export interface BaseFormattedTextInputProps<T> extends Omit<TextInputProps, 'value'> {
  value?: T | null,
  onChangeValue?: (value: T) => void
}

export interface FormattedTextInputProps<T> extends BaseFormattedTextInputProps<T> {
  format: (value: T) => string,
  parse: (text: string) => T
}

export const FormattedTextInput = forwardRef(<T, >(props: FormattedTextInputProps<T>, ref: any) => {
  const {
    format,
    parse,
    value,
    onChangeText: _onChangeText,
    onChangeValue,
    ...inputProps
  } = props

  const formattedValue = useMemo(() => value != null ? format(value) : '', [value, format])

  const onChangeText = useCallback((text: string) => {
    if (_onChangeText) _onChangeText(text)
    onChangeValue?.(parse(text))
  }, [onChangeValue, parse])

  return (
    <TextInput
      ref={ref}
      Input={Input}
      value={formattedValue}
      onChangeText={onChangeText}
      {...inputProps} />
  )
}) as <T>(p: FormattedTextInputProps<T> & { ref?: Ref<NativeMethods> }) => ReactElement

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
)) as ComponentType<ComponentPropsWithRef<typeof RNTextInput>>

const styles = StyleSheet.create({
  input: {
    ...StyleSheet.absoluteFillObject,
    color: 'rgba(0, 0, 0, 0)',
    backgroundColor: 'transparent'
  }
})
