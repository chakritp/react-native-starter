import PropTypes from 'prop-types'
import React from 'react'
import { StyleSheet } from 'react-native'
import { useTheme } from 'theme'
import { Transition } from './Transition'

export const Overlay = ({ bgColor = 'containerBg', style, ...props }) => {
  const theme = useTheme()
  return (
    <Transition
      style={[
        styles.container,
        { backgroundColor: theme.colors[bgColor] || bgColor },
        style
      ]}
      property="opacity"
      duration={props.transitionDuration}
      snapshotChildren
      hideWhen="out"
      in={props.show}>
      {props.children}
    </Transition>
  )
}

Overlay.propTypes = {
  bgColor: PropTypes.string,
  transitionDuration: PropTypes.number,
  show: PropTypes.bool,
  children: PropTypes.any
}

Overlay.defaultProps = {
  show: false
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
