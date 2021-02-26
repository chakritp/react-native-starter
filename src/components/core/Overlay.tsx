import React, { ReactNode } from 'react'
import { StyleSheet } from 'react-native'
import { BoxProps } from './common'
import { Transition } from './Transition'

export interface OverlayProps extends BoxProps {
  transitionDuration?: number
  show?: boolean
  children?: ReactNode
}

export const Overlay = ({
  style,
  backgroundColor = 'mainBackgroundRegular',
  transitionDuration,
  show = false,
  children
}: OverlayProps) => {
  return (
    <Transition
      style={[StyleSheet.absoluteFill, style]}
      alignItems="center"
      justifyContent="center"
      backgroundColor={backgroundColor}
      property="opacity"
      duration={transitionDuration}
      snapshotChildren
      hideWhen="out"
      in={show}>
      {children}
    </Transition>
  )
}
