import { useCallback, useEffect, useRef } from 'react'
import { BackHandler } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { showAlert } from 'helpers/ui'
import { apiErrorMessage } from 'helpers/i18n'
import { ApiNetworkError, ApiServerError } from 'lib/api'

export function useIsUpdate() {
  const isUpdate = useRef(false)
  useEffect(() => {
    isUpdate.current = true
  }, [])
  return isUpdate.current
}

export function useFocus(callback: (...args: any[]) => any, deps: any[]) {
  return useFocusEffect(useCallback(callback, deps))
}

export function useBackHandler(onBack: (...args: any[]) => any | boolean) {
  return useFocus(() => {
    if (onBack) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (typeof onBack === 'function') onBack()
        return true
      })
      return () => backHandler.remove()
    }
  }, [onBack])
}

export function useErrorAlert(options: {
  error?: Error | ApiNetworkError | ApiServerError
  ignoreValidationError?: boolean
  ignoreUnauthorized?: boolean
  scope?: string
  onError?: (error: Error | ApiNetworkError | ApiServerError) => string | boolean | undefined,
} = {}) {
  const {
    error,
    ignoreValidationError,
    ignoreUnauthorized = true,
    scope,
    onError,
    ...alertOptions
  } = options
  const errorRef = useRef(error)

  useEffect(() => {
    if (error && error !== errorRef.current) {
      if (error instanceof ApiServerError && error.code === 'app_upgrade_required') return
      
      switch ((error as any).status) {
        case 400:
          if (ignoreValidationError) return
          break
        case 401:
          if (ignoreUnauthorized) return
          break
      }

      let message: string | undefined

      if (onError) {
        const ret = onError(error)
        if (ret === false) return
        if (typeof ret === 'string' || ret === undefined) {
          message = ret
        }
      }
      
      if (!message) {
        message = apiErrorMessage(error, { scope })
      }

      showAlert({ message, ...alertOptions })
    }
  }, [error])
}
