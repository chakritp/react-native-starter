import React, { ComponentProps, ReactNode } from 'react'
import {
  Animated,
  TouchableOpacity as $TouchableOpacity,
  TouchableOpacityProps as $TouchableOpacityProps,
  TouchableHighlight as $TouchableHighlight,
  TouchableHighlightProps as $TouchableHighlightProps,
  ActivityIndicator as $ActivityIndicator,
  ActivityIndicatorProps as $ActivityIndicatorProps
} from 'react-native'
import { createBox, useTheme } from '@shopify/restyle'
import { Theme, ThemeColor } from 'theme'

export const Box = createBox<Theme>()
export type BoxProps = ComponentProps<typeof Box>

export const AnimatedBox = createBox<Theme>(Animated.View)

export const TouchableOpacity = createBox<Theme, $TouchableOpacityProps & { children?: ReactNode }>($TouchableOpacity)
export type TouchableOpacityProps = ComponentProps<typeof TouchableOpacity>

const BaseTouchableHighlight = createBox<Theme, $TouchableHighlightProps & { children?: ReactNode }>($TouchableHighlight)
export type TouchableHighlightProps = ComponentProps<typeof BaseTouchableHighlight> & { underlayColor?: ThemeColor }
export const TouchableHighlight = ({ underlayColor = 'mainBackgroundMedium', ...props }: TouchableHighlightProps) => {
  const theme = useTheme<Theme>()
  return <BaseTouchableHighlight underlayColor={theme.colors[underlayColor]} {...props} />
}

const BaseActivityIndicator = createBox<Theme, $ActivityIndicatorProps>($ActivityIndicator)
export type ActivityIndicatorProps = ComponentProps<typeof BaseActivityIndicator> & { color?: ThemeColor }
export const ActivityIndicator = ({ color = 'mainForegroundMuted', ...props }: ActivityIndicatorProps) => {
  const theme = useTheme<Theme>()
  return <BaseActivityIndicator color={theme.colors[color]} {...props} />
}
