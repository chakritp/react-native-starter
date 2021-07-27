import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Keyboard } from 'react-native'
import {
  FieldValues,
  UseFormProps as $UseFormProps,
  UseFormReturn as $UseFormReturn,
  SubmitHandler,
  useForm as $useForm,
  useFormContext as $useFormContext,
} from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'
import { yupResolver } from '@hookform/resolvers/yup'
import { AnyObjectSchema } from 'yup'
import i18n from 'i18n-js'
import { ApiNetworkError, ApiServerError } from 'lib/api'
import { FieldError, configureYup } from 'lib/form'
import { translateForm, fieldErrorMessage } from 'helpers/i18n'
import { UseErrorAlertOptions, useBackHandler, useErrorAlert } from '../hooks'
import { Toast } from '../Toast'
import { Path } from 'react-hook-form'

configureYup()

export interface UseFormProps<TFieldValues extends FieldValues = FieldValues, TContext extends object = object> extends $UseFormProps<TFieldValues, TContext> {
  name?: string
  schema?: AnyObjectSchema
  showValidationError?: (error: FieldError, field: string) => void
  onSubmit?: SubmitHandler<TFieldValues>
  onSuccess?: () => void
} 

export interface UseFormReturn<TFieldValues extends FieldValues = FieldValues> extends $UseFormReturn<TFieldValues> {
  defaultValues: UseFormProps<TFieldValues>['defaultValues']
  submitError?: Error | ApiNetworkError | ApiServerError
  registerFieldLabel: (field: string, label: string) => void
  translate: (scope: string, options?: i18n.TranslateOptions) => string
  submit: () => void
  showValidationError?: UseFormProps['showValidationError']
}

export function useForm<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
  options: UseFormProps<TFieldValues, TContext>
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
  const fieldLabels = useMemo<{[key: string]: string}>(() => ({}), [])
  const submitErrorRef = useRef<Error | ApiNetworkError | ApiServerError>()
  const onSubmitRef = useRef<UseFormProps<TFieldValues, TContext>['onSubmit']>()
  const onSuccessRef = useRef<UseFormProps<TFieldValues, TContext>['onSuccess']>()
  const submitCountRef = useRef(0)

  onSubmitRef.current = onSubmit
  onSuccessRef.current = onSuccess

  if (schema) {
    formOptions.resolver = yupResolver(schema)
  }

  const registerFieldLabel = useCallback((field: string, label: string) => {
    fieldLabels[field] = label
  }, [])

  // Scoped translation helper.
  const translate = useCallback((scope: string, options?: i18n.TranslateOptions) => translateForm(name, scope, options), [name])

  const form = $useForm(formOptions) as UseFormReturn<TFieldValues>
  form.defaultValues = _defaultValues

  const defaultShowValidationError = useCallback((error: FieldError, field: string) => {
    const label = fieldLabels[field]
    Toast.danger(fieldErrorMessage(error, { form: name, field, label }))
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
            form.setError(fieldName as Path<TFieldValues>, { message })
          }
        }
      } else if (onSuccessRef.current) {
        onSuccessRef.current()
      }
    })()
  }, [])

  useEffect(() => {
    if (submitCountRef.current !== form.formState.submitCount && _showValidationError) {
      const { errors } = form.formState
      if (errors) {
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
    registerFieldLabel,
    submitError: submitErrorRef.current,
    showValidationError: _showValidationError,
    translate,
    submit
  }
}

export function useFormErrorAlert<TFieldValues>(form: UseFormReturn<TFieldValues>, options: UseErrorAlertOptions) {
  return useErrorAlert({
    error: form.submitError,
    ignoreValidationError: true,
    ...options
  })
}

export function useFormScreen<TFieldValues extends FieldValues = FieldValues, TContext extends object = object>(
  options: UseFormProps<TFieldValues, TContext>
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

export const useFormContext = $useFormContext as <TFieldValues extends FieldValues>() => UseFormReturn<TFieldValues>
