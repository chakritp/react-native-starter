import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Animated } from 'react-native'
import { call } from 'utils/language'

export class Transition extends PureComponent {
  static propTypes = {
    style: PropTypes.any,
    property: PropTypes.string,
    transform: PropTypes.object,
    from: PropTypes.any.isRequired,
    to: PropTypes.any.isRequired,
    duration: PropTypes.number.isRequired,
    animateOnMount: PropTypes.bool,
    in: PropTypes.bool,
    snapshotChildren: PropTypes.bool,
    hideWhen: PropTypes.oneOf(['in', 'out']),
    useNativeDriver: PropTypes.bool,
    children: PropTypes.any,
    onTransitionBegin: PropTypes.func,
    onTransitionEnd: PropTypes.func
  }

  static defaultProps = {
    from: 0,
    to: 1,
    duration: 300,
    animateOnMount: false,
    in: false,
    useNativeDriver: true
  }

  constructor(props) {
    super(props)
    const { in: _in, from, to, animateOnMount } = props
    this.state = {
      animatedValue: new Animated.Value(animateOnMount ? from : _in ? to : from),
      finished: true 
    }
  }

  componentDidMount() {
    if (this.props.animateOnMount) {
      this.animate()
    }
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.in !== this.props.in) {
      this.animate(nextProps)
    }
  }

  getDirection(props = this.props) {
    return props.animateOnMount || props.in ? 'in' : 'out'
  }

  animate(props = this.props) {
    const { from, to, duration, useNativeDriver, snapshotChildren } = props
    const { animatedValue, finished } = this.state
    const direction = this.getDirection(props)
    const nextState = { finished: false }

    if (direction === 'in') {
      nextState.childrenSnapshot = null
    } else if (snapshotChildren) {
      nextState.childrenSnapshot = call(this.props.children)
    }

    this.setState(nextState, () => {
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
    const { style, children, property, transform, from, to, hideWhen } = this.props
    const { animatedValue, finished } = this.state

    if (finished && hideWhen === this.getDirection()) {
      return null
    }

    const animatedStyle = {}

    if (property) {
      animatedStyle[property] = animatedValue
    }

    if (transform) {
      animatedStyle.transform = Object.keys(transform).map(key => ({
        [key]: animatedValue.interpolate({
          inputRange: [from, to],
          outputRange: transform[key]
        })
      }))
    }
  
    return (
      <Animated.View style={[style, animatedStyle]}>
        {this.state.childrenSnapshot || call(children)}
      </Animated.View>
    )
  }
}
