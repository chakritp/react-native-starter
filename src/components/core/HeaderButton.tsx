import React from 'react'
import { Button, ButtonProps } from './Button'

export const HeaderButton = (props: ButtonProps) => {
  return (
    <Button
      size="s"
      transparent
      titleStyle={{ fontSize: 16 }}
      {...props} />
  )
}
