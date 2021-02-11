import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated
} from 'react-native'
import { Text } from './Text'
import { createThemedStyleSheet, withTheme } from 'theme'
import { renderIcon } from 'helpers/ui'

const INDICATOR_TRANSITION_DURATION = 500

class ButtonBase extends PureComponent {
  static propTypes = {
    variant: PropTypes.string,
    style: PropTypes.any,
    contentStyle: PropTypes.any,
    titleStyle: PropTypes.any,
    titleContainerStyle: PropTypes.any,
    size: PropTypes.string,
    rounded: PropTypes.bool,
    outline: PropTypes.bool,
    transparent: PropTypes.bool,
    align: PropTypes.string,
    icon: PropTypes.any,
    iconRight: PropTypes.bool,
    title: PropTypes.string,
    interactive: PropTypes.bool,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.string,
    onPress: PropTypes.func
  }

  static defaultProps = {
    interactive: true,
    accessible: true
  }

  constructor(props) {
    super(props)
    const { loading } = props

    this.state = {
      indicatorTransition: false,
      indicatorOpacity: new Animated.Value(loading ? 1 : 0),
      textOpacity: new Animated.Value(loading ? 0 : 1),
    }
  }

  componentDidUpdate(prevProps) {
    const { loading } = this.props
    if (loading !== prevProps.loading) {
      const { textOpacity, indicatorOpacity } = this.state
      if (loading) {
        this.startIndicatorTransition(indicatorOpacity, textOpacity)
      } else {
        this.startIndicatorTransition(textOpacity, indicatorOpacity)
      }
    }
  }

  startIndicatorTransition(first, second) {
    Animated.parallel([
      Animated.timing(first, {
        toValue: 1,
        INDICATOR_TRANSITION_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(second, {
        toValue: 0,
        INDICATOR_TRANSITION_DURATION,
        useNativeDriver: true
      }),
    ]).start(({ finished }) => {
      if (finished) {
        this.setState({ indicatorTransition: false })
      }
    })

    this.setState({ indicatorTransition: true })
  }

  render() {
    const { props } = this
    let {
      getStyles,
      theme,
      variant = 'primary',
      style,
      contentStyle,
      titleStyle,
      titleContainerStyle,
      size = 'm',
      rounded = false,
      transparent,
      align,
      title,
      icon,
      iconRight,
      disabled,
      loading,
      interactive,
      accessible,
      accessibilityLabel = title
    } = props

    const { indicatorTransition, indicatorOpacity, textOpacity } = this.state

    const styles = getStyles(themedStyles)
    let { bgColor, textColor, outlineColor, radius } = theme.buttonVariants[variant]

    if (transparent) {
      bgColor = 'transparent'
    }

    if (icon) {
      icon = renderIcon(icon, {
        style: title != null && { [iconRight ? 'marginLeft' : 'marginRight']: size === 's' ? 4 : 6 },
        color: textColor,
        size: size === 's' ? theme.fontSizes.s : size === 'l' ? theme.fontSizes.xl : theme.fontSizes.l
      })
    }

    const content = (
      <View
        style={[
          styles.content,
          size === 's' ? styles.contentSmall : size === 'l' ? styles.contentLarge : null,
          radius != null ? { borderRadius: radius } : null,
          rounded && styles.rounded,
          disabled && styles.disabled,
          { borderColor: outlineColor, backgroundColor: bgColor },
          !title ? { paddingHorizontal: 0 } : null,
          contentStyle
        ]}>
        <Animated.View style={[
          styles.titleContainer,
          titleContainerStyle,
          disabled && styles.disabled,
          { opacity: textOpacity }
        ]}>
          {!iconRight && icon}

          {title != null && (
            <Text
              style={[
                styles.title,
                size === 's' ? styles.titleSmall : size === 'l' ? styles.titleLarge : null,
                { color: textColor },
                titleStyle
              ]}
              numberOfLines={1}>
              {title}
            </Text>
          )}

          {iconRight && icon}
        </Animated.View>

        <Animated.View style={[styles.loadingIndicator, { opacity: indicatorOpacity }]}>
          {(indicatorTransition || loading) && (
            <ActivityIndicator size={size === 's' ? 'small' : 'large'} color={textColor} />
          )}
        </Animated.View>          
      </View>
    )
    
    return interactive ? (
      <TouchableOpacity
        style={[
          radius != null ? { borderRadius: radius } : null,
          rounded && styles.rounded,
          align && { alignSelf: align },
          style
        ]}
        activeOpacity={0.8}
        disabled={!!disabled || !!loading}
        accessible={accessible}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        onPress={props.onPress}>
        {content}
      </TouchableOpacity>
    ) : content
  }
}

export const Button = withTheme(ButtonBase)

const themedStyles = createThemedStyleSheet(theme => ({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: theme.sizes.m,
    height: theme.sizes.m,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderRadius: theme.radii.m
  },
  contentLarge: {
    minWidth: theme.sizes.l,
    height: theme.sizes.l,
    paddingHorizontal: 28
  },
  contentSmall: {
    minWidth: theme.sizes.s,
    height: theme.sizes.s,
    paddingHorizontal: 12,
    borderWidth: 1
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...theme.fonts.headerRegular,
    fontSize: theme.fontSizes.s,
    lineHeight: theme.fontSizes.s
  },
  titleSmall: {
    fontSize: theme.fontSizes.xs,
    lineHeight: theme.fontSizes.xs
  },
  titleLarge: {
    fontSize: theme.fontSizes.m,
    lineHeight: theme.fontSizes.m
  },
  loadingIndicator: {
    position: 'absolute'
  },
  rounded: {
    borderRadius: 100
  },
  disabled: {
    opacity: 0.6
  },
}))
