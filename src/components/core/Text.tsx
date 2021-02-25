import React, { ComponentPropsWithRef } from 'react'
import { createText, useTheme } from '@shopify/restyle'
import { Theme } from 'theme'

const BaseText = createText<Theme>()

export interface TextProps extends ComponentPropsWithRef<typeof BaseText> {
  font?: keyof Theme['fonts']
}

export const Text = ({
  font,
  ...props
}: TextProps) => {
  const theme = useTheme<Theme>()
  const fontProps = font ? theme.fonts[font] as any : undefined
  return <BaseText {...fontProps} {...props} />
}
