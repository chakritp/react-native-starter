import React from 'react'
import { Icon, IconProps } from '../Icon'

export const InputErrorIcon = ({ size = 'l', ...props }: Omit<IconProps, 'name'>) => {
  return (
    <Icon
      name="error"
      color="danger"
      size={size}
      {...props} />
  )
}
