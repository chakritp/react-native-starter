import React, { useCallback } from 'react'
import {
  Controller,
  ControllerRenderProps,
  FieldError,
  FieldName,
  FieldValues,
  InputState
} from 'react-hook-form'
import { useFormContext } from './hooks'

export interface FieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldName<TFieldValues>
  render: (field: ControllerRenderProps<TFieldValues>, state: InputState) => React.ReactElement
  onShowError?: (error: FieldError, name: FieldName<TFieldValues>) => void
}

export const Field = <TFieldValues, >({
  name,
  render,
  onShowError,
  ...props
}: FieldProps<TFieldValues>) => {
  const { control, errors, showValidationError } = useFormContext()
  const error = errors[name] as FieldError

  const _onShowError = useCallback(() => {
    if (error) {
      if (onShowError) {
        onShowError(error, name)
      } else if (showValidationError) {
        showValidationError(error, name)
      }
    }
  }, [onShowError, showValidationError, error])

  return (
    <Controller
      control={control}
      name={name as any}
      render={({ ref: _ref, ...renderProps }, state) => render({
        ...renderProps,
        hasError: !!error,
        onShowError: _onShowError
      } as any, state)}
      {...props}
    />
  )
}
