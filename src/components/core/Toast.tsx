import noop from 'lodash'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { View, Keyboard, TouchableOpacity } from 'react-native'
import { NavigationContext } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from './Text' 
import { Transition } from './Transition'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'

export const Toast = ({ offset = 0 }) => {
  const navigation = useContext(NavigationContext)
  const [focused, setFocused] = useState(navigation ? navigation.isFocused : true)
  const [keyboardOffset, setKeyboardOffset] = useState(0)
  const [config, setConfig] = useState()
  const nextKeyboardOffsetRef = useRef(0)
  const dismissTimer = useRef()
  const dismissCallback = useRef(noop)

  const instance = useMemo(() => ({
    show(config) {
      setConfig(config)
      clearTimeout(dismissTimer.current)
      dismissCallback.current = config.onHide
      dismissTimer.current = setTimeout(instance.hide, config.hideDelay || 2000)
    },
    hide() {
      if (dismissCallback.current) dismissCallback.current()
      dismissCallback.current = noop
      setConfig(null)
      clearTimeout(dismissTimer.current)
    }
  }), [])

  useEffect(() => {
    const subscriptions = []

    if (navigation) {
      subscriptions.push(navigation.addListener('focus', () => {
        setFocused(true)
      }))
      subscriptions.push(navigation.addListener('blur', () => {
        setFocused(false)
        setConfig(null)
      }))
    }

    // TODO: We might want to remove keyboard offset management since
    // forms dismiss the keyboard on submission by default.
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
      Toast._registerContainer(instance)
    } else {
      Toast._unregisterContainer(instance)
    }
    return () => Toast._unregisterContainer(instance)
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
      {() => <ToastModal {...config} onDismiss={instance.hide} />}
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

Toast._containers = []

Toast.show = config => {
  config = normalizeConfig(config)
  Toast._getActiveContainer().show({ ...config })
}

Toast.info = config => Toast.show(normalizeConfig(config, { type: 'info' }))

Toast.success = config => Toast.show(normalizeConfig(config, { type: 'success', hideDelay: 800 }))

Toast.warning = config => Toast.show(normalizeConfig(config, { type: 'warning' }))

Toast.danger = config => Toast.show(normalizeConfig(config, { type: 'danger' }))

Toast.hide = () => {
  const container = Toast._getActiveContainer()
  if (container) container.hide()
}

Toast.handleNavigationStateChange = (navState) => {
  Toast.hide()
}

Toast._registerContainer = function(container) {
  this._containers.push(container)
}

Toast._unregisterContainer = function(container) {
  const idx = this._containers.indexOf(container)
  if (idx > -1) this._containers.splice(idx, 1)
}

Toast._getActiveContainer = function() {
  return this._containers[this._containers.length - 1]
}

const ToastModal = ({ type = 'info', text, onDismiss }) => {
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

function normalizeConfig(config, defaults) {
  if (typeof config === 'string') {
    config = { text: config }
  }
  return defaults ? { ...defaults, ...config } : config
}
