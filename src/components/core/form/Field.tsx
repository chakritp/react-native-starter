import React, { useCallback } from 'react'
import {
  Controller,
  ControllerRenderProps as $ControllerRenderProps,
  FieldName,
  FieldValues,
  InputState
} from 'react-hook-form'
import { FieldError } from 'lib/form'
import { useFormContext } from './hooks'

export interface ControllerRenderProps<TFieldValues extends FieldValues> extends Omit<$ControllerRenderProps<TFieldValues>, 'ref'> {
  label?: string,
  hasError: boolean,
  onShowError: () => void
}

export interface FieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldName<TFieldValues>
  label?: string
  render: (field: ControllerRenderProps<TFieldValues>, state: InputState) => React.ReactElement
  onShowError?: (error: FieldError, name: FieldName<TFieldValues>) => void
}

export const Field = <TFieldValues, >({
  name,
  label,
  render,
  onShowError,
  ...props
}: FieldProps<TFieldValues>) => {
  const { control, errors, registerFieldLabel, showValidationError } = useFormContext()
  const error = errors[name] as FieldError

  if (label) {
    registerFieldLabel(name, label)
  }

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
        label,
        hasError: !!error,
        onShowError: _onShowError
      }, state)}
      {...props}
    />
  )
}
