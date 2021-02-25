import { ComponentProps, ReactNode } from 'react'
import {
  TouchableOpacity as $TouchableOpacity,
  TouchableOpacityProps as $TouchableOpacityProps
} from 'react-native'
import { createBox } from '@shopify/restyle'
import { Theme } from 'theme'

export const Box = createBox<Theme>()
export type BoxProps = ComponentProps<typeof Box>

export const TouchableOpacity = createBox<Theme, $TouchableOpacityProps & { children?: ReactNode }>($TouchableOpacity)
export type TouchableOpacityProps = ComponentProps<typeof TouchableOpacity>
