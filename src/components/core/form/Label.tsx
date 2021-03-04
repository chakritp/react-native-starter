import React from 'react'
import { Text, TextProps } from '../Text'

export interface LabelProps extends TextProps {
  inline?: boolean
}

export const Label = ({ inline, ...props }: LabelProps) => (
  <Text
    variant="p3"
    mb={inline ? 'none' : 's'}
    mr={inline ? 'm' : 'none'}
    font="bodyMedium"
    color="mainForegroundMedium"
    {...props} />
)
