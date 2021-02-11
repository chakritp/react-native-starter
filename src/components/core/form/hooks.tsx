
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Keyboard } from 'react-native'
import { useForm as useReactHookForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { yupResolver } from '@hookform/resolvers/yup'
import { translateForm, validationMessage } from 'helpers/i18n'
import { useBackHandler, useErrorAlert } from '../hooks'
import { Toast } from '../Toast'

export function useForm(options = {}) {
  const {
    name,
    schema,
    showValidationError,
    onSubmit,
    onSuccess,
    ...formOptions
  } = options

  const _defaultValues = useMemo(() => formOptions.defaultValues, [])
  const submitErrorRef = useRef()
  const onSubmitRef = useRef()
  const onSuccessRef = useRef()

  onSubmitRef.current = onSubmit
  onSuccessRef.current = onSuccess

  if (schema) {
    formOptions.resolver = yupResolver(schema)
  }

  // Add a scoped translation helper to props.
  const translate = useCallback((...args) => translateForm(name, ...args), [name])

  const form = useReactHookForm(formOptions)
  form.defaultValues = _defaultValues

  const defaultShowValidationError = useCallback((error, field) => {
    Toast.danger(validationMessage(error, { form: name, field }))
  }, [name])

  const _showValidationError = showValidationError === undefined
    ? defaultShowValidationError
    : showValidationError

  const submit = useCallback(() => {
    Keyboard.dismiss()

    form.handleSubmit(async (...args) => {
      submitErrorRef.current = undefined
      let error
      
      if (onSubmitRef.current) {
        try {
          const res = await onSubmitRef.current(...args)
          if (res) {
            error = res.error
          }
        } catch (err) {
          error = err
        }
      }
  
      submitErrorRef.current = error
  
      if (error) {
        if (error.code === 'invalid_request' && error.parameters) {
          for (const fieldName of Object.keys(error.parameters)) {
            const message = error.parameters[fieldName][0]
            form.setError(fieldName, { message })
          }
        }
      } else if (onSuccessRef.current) {
        onSuccessRef.current()
      }
    })()
  }, [])

  useEffect(() => {
    const { errors } = form
    if (errors && _showValidationError) {
      const field = Object.keys(errors)[0]
      if (field) {
        _showValidationError(errors[field], field)
      }
    }
  }, [form.errors, form.formState.isSubmitting, _showValidationError])

  return {
    ...form,
    name,
    submitError: submitErrorRef.current,
    showValidationError: _showValidationError,
    translate,
    submit
  }
}

export function useFormErrorAlert(form, options) {
  return useErrorAlert({
    error: form.submitError,
    ignoreValidationError: true,
    ...options
  })
}

export function useFormScreen(options) {
  const form = useForm(options)
  const { isSubmitting } = form.formState
  const navigation = useNavigation()

  useBackHandler(true)

  useLayoutEffect(() => {
    navigation.setOptions({
      gesturesEnabled: !isSubmitting,
      headerLeft: isSubmitting ? null : undefined
    })
  }, [isSubmitting])

  return form
}
