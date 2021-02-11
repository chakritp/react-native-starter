import React, { useEffect, useMemo, useState } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import { useIsUpdate } from './hooks'

export const Swapper = ({ deps = [], itemStyle, duration = 300, children, ...props }) => {
  const [backChildren, setBackChildren] = useState()
  const [frontChildren, setFrontChildren] = useState(children)
  const frontOpacity = useMemo(() => new Animated.Value(children ? 1 : 0), [])
  const backOpacity = useMemo(() => Animated.subtract(1, frontOpacity), [])
  const isUpdate = useIsUpdate()
  
  useEffect(() => {
    if (frontChildren) {
      setBackChildren(frontChildren)
    }

    setFrontChildren(children)

    if (isUpdate && frontChildren) {
      frontOpacity.setValue(0)
      Animated.timing(frontOpacity, { toValue: 1, duration, useNativeDriver: true }).start()
    }
  }, deps)

  return (
    <View {...props}>
      <Animated.View style={[styles.item, itemStyle, { opacity: backOpacity }]}>
        {backChildren}
      </Animated.View>
      <Animated.View style={[styles.item, itemStyle, { opacity: frontOpacity }]}>
        {frontChildren}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
