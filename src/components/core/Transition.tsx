import React, { PureComponent, ReactElement, ReactNode } from 'react'
import { Animated, StyleProp, ViewStyle } from 'react-native'
import { call } from 'utils/language'

type TransformDirection = 'in' | 'out'

export interface TransitionProps {
  style?: StyleProp<ViewStyle>
  property: keyof Animated.WithAnimatedObject<ViewStyle>
  transform?: { [key: string]: number[] }
  from?: number
  to?: number
  duration?: number
  animateOnMount?: boolean
  in?: boolean
  snapshotChildren?: boolean
  hideWhen?: TransformDirection
  useNativeDriver?: boolean
  children?: ReactNode
  onTransitionBegin?: (direction: TransformDirection) => void
  onTransitionEnd?: (direction: TransformDirection) => void
}

type DefaultProps = Required<Pick<TransitionProps, 'from' | 'to' | 'duration' | 'animateOnMount' | 'in' | 'useNativeDriver'>>

type PropsInternal = TransitionProps & DefaultProps

interface TransitionState {
  animatedValue: Animated.Value
  childrenSnapshot?: ReactElement
  finished: boolean
}

export class Transition extends PureComponent<TransitionProps, TransitionState> {
  unmounted: boolean = false

  static defaultProps = {
    from: 0,
    to: 1,
    duration: 300,
    animateOnMount: false,
    in: false,
    useNativeDriver: true
  }

  constructor(props: PropsInternal) {
    super(props)
    const { in: _in, from, to, animateOnMount } = props
    this.state = {
      animatedValue: new Animated.Value(animateOnMount ? from : _in ? to : from),
      finished: true 
    }
  }

  componentDidMount() {
    if (this.props.animateOnMount) {
      this.animate(this.props as PropsInternal)
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  UNSAFE_componentWillReceiveProps(nextProps: PropsInternal) {
    if (nextProps.in !== this.props.in) {
      this.animate(nextProps)
    }
  }

  getDirection(props = this.props) {
    return props.animateOnMount || props.in ? 'in' : 'out'
  }

  animate(props: PropsInternal) {
    const { from, to, duration, useNativeDriver, snapshotChildren } = props
    const { animatedValue, finished } = this.state
    const direction = this.getDirection(props)
    const nextState: Partial<TransitionState> = { finished: false }

    if (direction === 'in') {
      nextState.childrenSnapshot = undefined
    } else if (snapshotChildren) {
      nextState.childrenSnapshot = call(this.props.children)
    }

    this.setState<never>(nextState, () => {
      const { onTransitionBegin } = this.props
      if (finished && onTransitionBegin) {
        onTransitionBegin(direction)
      }
    })

    Animated.timing(animatedValue, {
      toValue: direction === 'in' ? to : from,
      duration,
      useNativeDriver
    })
      .start(({ finished }) => {
        if (finished && !this.unmounted) {
          this.setState({ finished })
          const { onTransitionEnd } = this.props
          onTransitionEnd && onTransitionEnd(direction)
        }
      })
  }

  render() {
    const { style, children, property, transform, from, to, hideWhen } = this.props as PropsInternal
    const { animatedValue, finished } = this.state

    if (finished && hideWhen === this.getDirection()) {
      return null
    }

    const animatedStyle: any = {}

    if (property) {
      animatedStyle[property] = animatedValue
    }

    if (transform) {
      animatedStyle.transform = Object.keys(transform).map(key => ({
        [key]: animatedValue.interpolate({
          inputRange: [from, to],
          outputRange: transform[key]
        })
      })) as any
    }
  
    return (
      <Animated.View style={[style, animatedStyle]}>
        {this.state.childrenSnapshot || call(children)}
      </Animated.View>
    )
  }
}
