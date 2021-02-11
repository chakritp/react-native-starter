import React from 'react'
import { Button } from './Button'

export const HeaderButton = (props) => {
  return (
    <Button
      size="s"
      transparent
      titleStyle={{ fontSize: 16 }}
      {...props} />
  )
}
