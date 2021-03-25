import React, { isValidElement, ReactElement } from 'react'
import { Alert, AlertButton } from 'react-native'
import { IconProps, Icon } from 'components/core/Icon'
import { t } from './i18n'

export type IconProp = ReactElement | IconProps | string

export function renderIcon(
  icon: IconProp,
  props: Partial<IconProps> = {}
) {
  if (!isValidElement(icon)) {
    if (typeof icon === 'string') icon = { name: icon }
    const { style: defaultStyle, ...defaultProps } = props
    const { style, ...customProps } = icon as any

    return (
      <Icon
        style={[defaultStyle, style]}
        {...defaultProps}
        {...customProps} />
    )
  }

  return icon
}

export interface ShowAlertOptions {
  title?: string
  message?: string
  onDismiss?: () => void
  defaultAction?: Partial<AlertButton>
  actions?: AlertButton[]
  extraActions?: AlertButton[]
}

export function showAlert(options: ShowAlertOptions = {}) {
  let {
    title = '',
    message,
    onDismiss,
    defaultAction = { text: t('actions.ok') },
    actions = [{ onPress: onDismiss, ...defaultAction }],
    extraActions = [],
  } = options

  Alert.alert(
    title,
    message,
    [...actions, ...extraActions],
    { cancelable: false }
  )
}
