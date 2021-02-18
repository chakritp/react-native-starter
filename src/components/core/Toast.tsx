import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, Keyboard, TouchableOpacity } from 'react-native'
import { NavigationContext } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from './Text' 
import { Transition } from './Transition'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'

export enum ToastType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger'
}

export interface ToastConfig {
  type?: ToastType
  text: string
  hideDelay?: number
  onHide?: () => void
}

interface ToastController {
  show: (config: ToastConfig) => void
  hide: () => void
}

export const Toast = ({ offset = 0 }) => {
  const navigation = useContext(NavigationContext)
  const [focused, setFocused] = useState(navigation ? navigation.isFocused : true)
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const [config, setConfig] = useState<ToastConfig | null>(null)
  const nextKeyboardOffsetRef = useRef(0)
  const dismissTimer = useRef<NodeJS.Timeout | undefined>()
  const dismissCallback = useRef<ToastConfig['onHide'] | null>()

  const controller = useMemo<ToastController>(() => ({
    show(config: ToastConfig) {
      setConfig(config)
      if (dismissTimer.current !== undefined) {
        clearTimeout(dismissTimer.current)
      }
      dismissCallback.current = config.onHide
      dismissTimer.current = setTimeout(controller.hide, config.hideDelay || 2000)
    },
    hide() {
      if (dismissCallback.current) dismissCallback.current()
      dismissCallback.current = null
      setConfig(null)
      if (dismissTimer.current !== undefined) {
        clearTimeout(dismissTimer.current)
      }
    }
  }), [])

  useEffect(() => {
    const subscriptions: any[] = []

    if (navigation) {
      subscriptions.push(navigation.addListener('focus', () => {
        setFocused(true)
      }))
      subscriptions.push(navigation.addListener('blur', () => {
        setFocused(false)
        setConfig(null)
      }))
    }

    subscriptions.push(Keyboard.addListener('keyboardDidShow', e => {
      nextKeyboardOffsetRef.current = e.endCoordinates.height
    }))
    subscriptions.push(Keyboard.addListener('keyboardDidHide', () => {
      nextKeyboardOffsetRef.current = 0
    }))

    return () => subscriptions.forEach(s => s.remove ? s.remove() : s())
  }, [])

  useEffect(() => {
    if (focused) {
      Toast._registerController(controller)
    } else {
      Toast._unregisterController(controller)
    }
    return () => Toast._unregisterController(controller)
  }, [focused])

  const modal = (
    <Transition
      property="opacity"
      hideWhen="out"
      snapshotChildren
      style={keyboardOffset ? null : { marginBottom: offset }}
      in={!!config}
      onTransitionBegin={() => {
        setKeyboardOffset(nextKeyboardOffsetRef.current)
      }}>
      {() => config ? <ToastModal {...config} onDismiss={controller.hide} /> : null}
    </Transition>
  )

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        bottom: keyboardOffset
      }}
      pointerEvents="box-none">
      {keyboardOffset ? modal : (
        <SafeAreaView pointerEvents="box-none">
          {modal}
        </SafeAreaView>
      )}
    </View>
  )
}

Toast.TAB_BAR_OFFSET = 48

Toast._controllers = [] as ToastController[]

Toast.show = (config: ToastConfig | string) => {
  config = normalizeConfig(config)
  Toast._getActiveController().show({ ...config })
}

Toast.info = (config: ToastConfig | string) => Toast.show(normalizeConfig(config, { type: ToastType.INFO }))

Toast.success = (config: ToastConfig | string) => Toast.show(normalizeConfig(config, { type: ToastType.SUCCESS, hideDelay: 800 }))

Toast.warning = (config: ToastConfig | string) => Toast.show(normalizeConfig(config, { type: ToastType.WARNING }))

Toast.danger = (config: ToastConfig | string) => Toast.show(normalizeConfig(config, { type: ToastType.DANGER }))

Toast.hide = () => {
  const controller = Toast._getActiveController()
  if (controller) controller.hide()
}

Toast.handleNavigationStateChange = (_navState: object) => {
  Toast.hide()
}

Toast._registerController = function(controller: ToastController) {
  this._controllers.push(controller)
}

Toast._unregisterController = function(controller: ToastController) {
  const idx = this._controllers.indexOf(controller)
  if (idx > -1) this._controllers.splice(idx, 1)
}

Toast._getActiveController = function() {
  return this._controllers[this._controllers.length - 1]
}

const ToastModal = ({ type = ToastType.INFO, text, onDismiss }: { type?: ToastType, text: string, onDismiss?: () => void }) => {
  const theme = useTheme()
  const styles = useStyles(themedStyles)
  return (
    <TouchableOpacity
      style={[styles.modal, { backgroundColor: theme.colors[type] }]}
      activeOpacity={1}
      onPress={onDismiss}>
      <Text.P4 align="center" color="white">{text}</Text.P4>
    </TouchableOpacity>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  modal: {
    margin: theme.spacing.l,
    padding: theme.spacing.m,
    borderRadius: theme.radii.m,
    backgroundColor: theme.colors.info
  }
}))

function normalizeConfig(config: ToastConfig | string, defaults?: Partial<ToastConfig>) {
  if (typeof config === 'string') {
    config = { text: config } as ToastConfig
  }
  return defaults ? { ...defaults, ...config } : config
}
