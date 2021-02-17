import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Overlay, OverlayProps } from './Overlay'
import { ThemeColor, useTheme } from 'theme'
import { Text } from './Text'

export interface LoadingOverlayProps extends OverlayProps {
  contentColor?: ThemeColor | string
  text?: string
}

export const LoadingOverlay = ({
  contentColor = 'text',
  text,
  children,
  ...props
}: LoadingOverlayProps) => {
  const theme = useTheme()
  contentColor = theme.colors[contentColor as ThemeColor] || contentColor

  return (
    <Overlay {...props}>
      <ActivityIndicator size="large" color={contentColor} />
      {(text || children) && (
        <View style={{ marginTop: theme.spacing.l }}>
          {text && <Text.S3 color={contentColor} align="center">{text}</Text.S3>}
          {children}
        </View>
      )}
    </Overlay>
  )
}
