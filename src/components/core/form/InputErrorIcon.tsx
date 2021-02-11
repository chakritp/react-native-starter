import React from 'react'
import { useTheme } from 'theme'
import { Icon } from '../Icon'

export const InputErrorIcon = ({ size, ...props }) => {
  const theme = useTheme()
  return (
    <Icon
      name="error"
      color="danger"
      size={size || theme.fontSizes.l}
      {...props} />
  )
}
