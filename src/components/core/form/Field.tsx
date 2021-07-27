import React, { useCallback } from 'react'
import {
  Controller,
  ControllerProps,
  ControllerRenderProps as $ControllerRenderProps,
  FieldPath,
  FieldValues
} from 'react-hook-form'
import { FieldError } from 'lib/form'
import { useFormContext } from './hooks'

export interface ControllerRenderProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Omit<$ControllerRenderProps<TFieldValues, TName>, 'ref' | 'value'> {
  value?: any,
  label?: string,
  hasError: boolean,
  onShowError: () => void
}

export interface FieldProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> extends Omit<ControllerProps<TFieldValues, TName>, 'render'> {
  label?: string
  render: (field: ControllerRenderProps<TFieldValues, TName>) => React.ReactElement
  onShowError?: (error: FieldError, name: FieldPath<TFieldValues>) => void
}

export const Field = <TFieldValues, >({
  name,
  label,
  render,
  onShowError,
  ...props
}: FieldProps<TFieldValues>) => {
  const { control, formState, registerFieldLabel, showValidationError } = useFormContext<TFieldValues>()
  const error = formState.errors[name] as FieldError

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
    <Controller<TFieldValues>
      control={control}
      name={name}
      render={({ field }) => {
        const { ref: _ref, ...fieldWithoutRef } = field
        return render({
          ...fieldWithoutRef,
          label,
          hasError: !!error,
          onShowError: _onShowError
        })
      }}
      {...props}
    />
  )
}
