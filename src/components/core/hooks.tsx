import { useCallback, useEffect, useRef } from 'react'
import { BackHandler } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { showAlert } from 'helpers/ui'
import { apiErrorMessage } from 'helpers/i18n'

export function useIsUpdate() {
  const isUpdate = useRef(false)
  useEffect(() => {
    isUpdate.current = true
  }, [])
  return isUpdate.current
}

export function useFocus(callback, propArray) {
  return useFocusEffect(useCallback(callback, propArray))
}

export function useBackHandler(onBack) {
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

export function useErrorAlert(options = {}) {
  const {
    task,
    error = task && task.error,
    ignoreValidationError = false,
    ignoreUnauthorized = true,
    scope,
    onError,
    ...alertOptions
  } = options
  const errorRef = useRef(error)

  useEffect(() => {
    if (error && error !== errorRef.current) {
      if (error.code === 'app_upgrade_required') return
      
      switch (error.status) {
        case 400:
          if (ignoreValidationError) return
          break
        case 401:
          if (ignoreUnauthorized) return
          break
      }

      let message
      if (onError) {
        message = onError(error)
        if (message === false) return
      }
      if (!message) {
        message = apiErrorMessage(error, { scope })
      }

      showAlert({ message, ...alertOptions })

      if (__DEV__) {
        console.log(error)
      }
    }
  }, [error])
}
