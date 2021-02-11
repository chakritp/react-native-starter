import React from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Overlay } from './Overlay'
import { useTheme } from 'theme'
import { Text } from './Text'

export const LoadingOverlay = ({
  contentColor = 'text',
  text,
  show,
  children,
  ...props
}) => {
  const theme = useTheme()
  contentColor = theme.colors[contentColor] || contentColor

  return (
    <Overlay show={show} {...props}>
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
