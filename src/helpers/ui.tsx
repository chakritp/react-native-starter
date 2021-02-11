import React, { isValidElement, ReactNode } from 'react'
import { Alert, AlertButton } from 'react-native'
import { IconProps, Icon } from 'components/core/Icon'
import { t } from './i18n'

export type IconProp = ReactNode | IconProps | string

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

export function showAlert(options: {
  title?: string
  message?: string
  onDismiss?: () => void
  defaultAction?: Partial<AlertButton>
  actions?: AlertButton[]
  extraActions?: AlertButton[]
} = {}) {
  let {
    title = '',
    message,
    onDismiss = () => {},
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
