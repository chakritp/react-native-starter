import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from './common'
import { Icon, IconProps } from './Icon'

const DEFAULT_HIT_SLOP = { top: 10, left: 10, bottom: 10, right: 10 }

export type IconButtonProps = TouchableOpacityProps & Pick<IconProps, 'type' | 'name' | 'size' | 'color'>

export const IconButton = ({
  type,
  name,
  size,
  color,
  ...props
} : IconButtonProps) => {
  return (
    <TouchableOpacity hitSlop={DEFAULT_HIT_SLOP} activeOpacity={0.6} {...props}>
      <Icon type={type} name={name} size={size} color={color} />
    </TouchableOpacity>
  )
}
