import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { ThemeColor, useTheme } from 'theme'
import { Transition } from './Transition'

export interface OverlayProps {
  style?: StyleProp<ViewStyle>
  bgColor?: ThemeColor | string
  transitionDuration?: number
  show?: boolean
  children?: ReactNode
}

export const Overlay = ({
  style,
  bgColor = 'containerBg',
  transitionDuration,
  show = false,
  children
}: OverlayProps) => {
  const theme = useTheme()
  return (
    <Transition
      style={[
        styles.container,
        { backgroundColor: theme.colors[bgColor as ThemeColor] || bgColor },
        style
      ]}
      property="opacity"
      duration={transitionDuration}
      snapshotChildren
      hideWhen="out"
      in={show}>
      {children}
    </Transition>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
