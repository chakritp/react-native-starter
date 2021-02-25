import { createBox, BoxProps as $BoxProps } from '@shopify/restyle'
import { Theme } from 'theme'

export const Box = createBox<Theme>()
export type BoxProps = $BoxProps<Theme>
