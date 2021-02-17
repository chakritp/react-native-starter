import React, { ReactNode, PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  FlexAlignType,
  TouchableWithoutFeedbackProps
} from 'react-native'
import { IconProp, renderIcon } from 'helpers/ui'
import { ThemeContextProps, ButtonVariant, createThemedStyleSheet, withTheme } from 'theme'
import { Text } from './Text'

const INDICATOR_TRANSITION_DURATION = 500

export interface ButtonProps {
  variant?: ButtonVariant
  style?: StyleProp<ViewStyle>
  contentStyle?: StyleProp<ViewStyle>
  titleContainerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  size?: 's' | 'm' | 'l'
  rounded?: boolean
  outline?: boolean
  transparent?: boolean
  align?: FlexAlignType
  icon?: IconProp,
  iconPlacement?: 'left' | 'right'
  title?: string
  interactive?: boolean
  disabled?: boolean
  loading?: boolean
  accessible?: boolean
  accessibilityLabel?: string
  children?: ReactNode
  onPress?: TouchableWithoutFeedbackProps['onPress']
}

interface ButtonPropsInternal extends ButtonProps, ThemeContextProps {}

interface ButtonState {
  indicatorTransition: boolean
  indicatorOpacity: Animated.Value
  contentOpacity: Animated.Value
}

class ButtonBase extends PureComponent<ButtonPropsInternal, ButtonState> {
  constructor(props: ButtonPropsInternal) {
    super(props)
    const { loading } = props

    this.state = {
      indicatorTransition: false,
      indicatorOpacity: new Animated.Value(loading ? 1 : 0),
      contentOpacity: new Animated.Value(loading ? 0 : 1),
    }
  }

  componentDidUpdate(prevProps: ButtonPropsInternal) {
    const { loading } = this.props
    if (loading !== prevProps.loading) {
      const { contentOpacity, indicatorOpacity } = this.state
      if (loading) {
        this.startIndicatorTransition(indicatorOpacity, contentOpacity)
      } else {
        this.startIndicatorTransition(contentOpacity, indicatorOpacity)
      }
    }
  }

  startIndicatorTransition(first: Animated.Value, second: Animated.Value) {
    Animated.parallel([
      Animated.timing(first, {
        toValue: 1,
        duration: INDICATOR_TRANSITION_DURATION,
        useNativeDriver: true
      }),
      Animated.timing(second, {
        toValue: 0,
        duration: INDICATOR_TRANSITION_DURATION,
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
      iconPlacement = 'left',
      disabled,
      loading,
      interactive = true,
      accessible = true,
      accessibilityLabel = title,
      children
    } = props

    const { indicatorTransition, indicatorOpacity, contentOpacity } = this.state

    const styles = getStyles(themedStyles)
    let { bgColor, textColor, outlineColor, radius } = theme.buttonVariants[variant]

    if (transparent) {
      bgColor = 'transparent'
    }

    if (icon) {
      icon = renderIcon(icon, {
        style: title != null && { [iconPlacement === 'left' ? 'marginRight' : 'marginLeft']: size === 's' ? 4 : 6 },
        color: textColor,
        size: size === 's' ? theme.fontSizes.xs : size === 'l' ? theme.fontSizes.l : theme.fontSizes.m
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
          { opacity: contentOpacity }
        ]}>
          {iconPlacement === 'left' && icon}

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

          {iconPlacement === 'right' && icon}

          {children}
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
    paddingHorizontal: 20,
    borderWidth: 2,
    borderRadius: theme.radii.m
  },
  contentLarge: {
    minWidth: theme.sizes.l,
    height: theme.sizes.l,
    paddingHorizontal: 24
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
