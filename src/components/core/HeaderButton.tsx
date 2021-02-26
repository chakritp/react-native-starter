import React from 'react'
import { Button, ButtonProps } from './Button'

export const HeaderButton = (props: ButtonProps) => {
  return (
    <Button
      variant="primaryTransparent"
      size="s"
      titleStyle={{ fontSize: 16 }}
      {...props} />
  )
}
