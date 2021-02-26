import React from 'react'
import { IconButton, IconButtonProps } from '../IconButton'

export const InputErrorIcon = ({ size = 'l', ...props }: Omit<IconButtonProps, 'name'>) => {
  return (
    <IconButton
      name="error"
      color="dangerRegular"
      size={size}
      {...props} />
  )
}
