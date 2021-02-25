import React, { ComponentProps, ReactNode } from 'react'
import {
  TouchableOpacity as $TouchableOpacity,
  TouchableOpacityProps as $TouchableOpacityProps,
  TouchableHighlight as $TouchableHighlight,
  TouchableHighlightProps as $TouchableHighlightProps,
  ActivityIndicator as $ActivityIndicator,
  ActivityIndicatorProps as $ActivityIndicatorProps
} from 'react-native'
import { createBox, useTheme } from '@shopify/restyle'
import { Theme } from 'theme'

export const Box = createBox<Theme>()
export type BoxProps = ComponentProps<typeof Box>

export const TouchableOpacity = createBox<Theme, $TouchableOpacityProps & { children?: ReactNode }>($TouchableOpacity)
export type TouchableOpacityProps = ComponentProps<typeof TouchableOpacity>

const BaseTouchableHighlight = createBox<Theme, $TouchableHighlightProps & { children?: ReactNode }>($TouchableHighlight)
export type TouchableHighlightProps = ComponentProps<typeof BaseTouchableHighlight> & { underlayColor?: keyof Theme['colors'] }
export const TouchableHighlight = ({ underlayColor = 'mainBackgroundMedium', ...props }: TouchableHighlightProps) => {
  const theme = useTheme<Theme>()
  return <BaseTouchableHighlight underlayColor={theme.colors[underlayColor]} {...props} />
}

const BaseActivityIndicator = createBox<Theme, $ActivityIndicatorProps>($ActivityIndicator)
export type ActivityIndicatorProps = ComponentProps<typeof BaseActivityIndicator> & { color?: keyof Theme['colors'] }
export const ActivityIndicator = ({ color = 'mainForegroundMuted', ...props }: ActivityIndicatorProps) => {
  const theme = useTheme<Theme>()
  return <BaseActivityIndicator color={theme.colors[color]} {...props} />
}
