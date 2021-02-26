import React from 'react'
import { Box, ActivityIndicator } from './common'
import { Overlay, OverlayProps } from './Overlay'
import { ThemeColor } from 'theme'
import { Text } from './Text'

export interface LoadingOverlayProps extends OverlayProps {
  foregroundColor?: ThemeColor
  text?: string
}

export const LoadingOverlay = ({
  foregroundColor = 'mainForegroundRegular',
  text,
  children,
  ...props
}: LoadingOverlayProps) => {
  return (
    <Overlay {...props}>
      <ActivityIndicator size="large" color={foregroundColor} />
      {(text || children) && (
        <Box mt="l">
          {text && <Text variant="s3" color={foregroundColor} textAlign="center">{text}</Text>}
          {children}
        </Box>
      )}
    </Overlay>
  )
}
