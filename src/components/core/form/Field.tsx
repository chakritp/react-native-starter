import React, { useCallback } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

export const Field = ({
  name,
  render = () => {},
  onShowError,
  ...props
}) => {
  const { control, errors, showValidationError } = useFormContext()
  const error = errors[name]

  const _onShowError = useCallback(() => {
    if (onShowError !== undefined) {
      onShowError(error, name)
    } else {
      showValidationError && showValidationError(error, name)
    }
  }, [onShowError, showValidationError, error])

  return (
    <Controller
      control={control}
      name={name}
      render={({ ref: _ref, ...renderProps }) => render({
        ...renderProps,
        hasError: !!error,
        onShowError: _onShowError
      })}
      {...props}
    />
  )
}
