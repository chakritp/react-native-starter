
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Keyboard } from 'react-native'
import {
  FieldName,
  FieldValues,
  UseFormOptions as $UseFormOptions,
  UseFormMethods as $UseFormMethods,
  SubmitHandler,
  FieldError,
  useForm as $useForm,
  useFormContext as $useFormContext,
} from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { yupResolver } from '@hookform/resolvers/yup'
import { AnyObjectSchema } from 'yup'
import i18n from 'i18n-js'
import { ApiNetworkError, ApiServerError } from 'lib/api'
import { translateForm, validationErrorMessage } from 'helpers/i18n'
import { UseErrorAlertOptions, useBackHandler, useErrorAlert } from '../hooks'
import { Toast } from '../Toast'

export interface UseFormOptions<TFieldValues extends FieldValues = FieldValues, TContext extends object = object> extends $UseFormOptions<TFieldValues, TContext> {
  name?: string
  schema?: AnyObjectSchema
  showValidationError?: (error: FieldError, field: string) => void
  onSubmit?: SubmitHandler<TFieldValues>
  onSuccess?: () => void
} 

export interface UseFormMethods<TFieldValues extends FieldValues = FieldValues> extends $UseFormMethods<TFieldValues> {
  defaultValues: UseFormOptions<TFieldValues>['defaultValues']
  submitError?: Error | ApiNetworkError | ApiServerError
  translate: (scope: string, options?: i18n.TranslateOptions) => string
  submit: () => void
  showValidationError?: UseFormOptions['showValidationError']
}

export function useForm<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
  options: UseFormOptions<TFieldValues, TContext>
) {
  const {
    name = 'common',
    schema,
    showValidationError,
    onSubmit,
    onSuccess,
    ...formOptions
  } = options

  const _defaultValues = useMemo(() => formOptions.defaultValues, [])
  const submitErrorRef = useRef<Error | ApiNetworkError | ApiServerError>()
  const onSubmitRef = useRef<UseFormOptions<TFieldValues, TContext>['onSubmit']>()
  const onSuccessRef = useRef<UseFormOptions<TFieldValues, TContext>['onSuccess']>()
  const submitCountRef = useRef(0)

  onSubmitRef.current = onSubmit
  onSuccessRef.current = onSuccess

  if (schema) {
    formOptions.resolver = yupResolver(schema)
  }

  // Add a scoped translation helper to props.
  const translate = useCallback((scope: string, options?: i18n.TranslateOptions) => translateForm(name, scope, options), [name])

  const form = $useForm(formOptions) as UseFormMethods<TFieldValues>
  form.defaultValues = _defaultValues

  const defaultShowValidationError = useCallback((error: FieldError, field: string) => {
    Toast.danger(validationErrorMessage(error, { form: name, field }))
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
            form.setError(fieldName as FieldName<TFieldValues>, { message })
          }
        }
      } else if (onSuccessRef.current) {
        onSuccessRef.current()
      }
    })()
  }, [])

  useEffect(() => {
    if (submitCountRef.current !== form.formState.submitCount) {
      const { errors } = form
      if (errors && _showValidationError) {
        const field = Object.keys(errors)[0]
        if (field && errors[field]) {
          _showValidationError(errors[field] as FieldError, field)
        }
      }
    }
    submitCountRef.current = form.formState.submitCount
  }, [form.formState.submitCount])

  return {
    ...form,
    name,
    submitError: submitErrorRef.current,
    showValidationError: _showValidationError,
    translate,
    submit
  }
}

export function useFormErrorAlert(form: UseFormMethods, options: UseErrorAlertOptions) {
  return useErrorAlert({
    error: form.submitError,
    ignoreValidationError: true,
    ...options
  })
}

export function useFormScreen<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
  options: UseFormOptions<TFieldValues, TContext>
) {
  const form = useForm<TFieldValues, TContext>(options)
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

export const useFormContext = $useFormContext as <TFieldValues extends Record<string, any>>() => UseFormMethods<TFieldValues>
