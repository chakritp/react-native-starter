import React, { useLayoutEffect, useMemo, useState, useRef } from 'react'
import {
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { useVariant } from 'lib/restyle'
import { IconProp, renderIcon } from 'helpers/ui'
import { Theme, ThemeColor } from 'theme'
import { BoxProps, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from './common'
import { Text } from './Text'

const INDICATOR_TRANSITION_DURATION = 500

export interface ButtonProps extends TouchableOpacityProps {
  variant?: keyof Omit<Theme['buttonVariants'], 'defaults'>
  contentContainerStyle?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  size?: 's' | 'm' | 'l'
  rounded?: boolean
  outline?: boolean
  icon?: IconProp | null,
  iconPlacement?: 'left' | 'right'
  title?: string
  interactive?: boolean
  disabled?: boolean
  loading?: boolean
  onPress?: TouchableOpacityProps['onPress']
}

export const Button = ({
  variant = 'primary',
  style,
  contentContainerStyle,
  titleStyle,
  size = 'm',
  rounded = false,
  title,
  icon,
  iconPlacement = 'left',
  disabled,
  loading,
  interactive = true,
  accessibilityLabel = title,
  children,
  ...props
}: ButtonProps) => {
  const [indicatorTransition, setIndicatorTransition] = useState(false)
  const indicatorOpacity = useMemo(() => new Animated.Value(loading ? 1 : 0), [])
  const contentOpacity = useMemo(() => new Animated.Value(loading ? 0 : 1), [])
  const loadingRef = useRef(loading)

  useLayoutEffect(() => {
    if (loading !== loadingRef.current) {
      loadingRef.current = loading
      if (loading) {
        startIndicatorTransition(indicatorOpacity, contentOpacity)
      } else {
        startIndicatorTransition(contentOpacity, indicatorOpacity)
      }
    }
  }, [loading])

  const startIndicatorTransition = (first: Animated.Value, second: Animated.Value) => {
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
        setIndicatorTransition(false)
      }
    })

    setIndicatorTransition(true)
  }

  const theme = useTheme<Theme>()
  const variantProps = useVariant(theme, 'buttonVariants', variant)

  const {
    backgroundColor,
    borderColor,
    borderRadius
  } = variantProps as BoxProps

  const {
    foregroundColor
  } = variantProps as { foregroundColor: ThemeColor }

  if (icon) {
    icon = renderIcon(icon, {
      style: title != null && { [iconPlacement === 'right' ? 'marginLeft' : 'marginRight']: size === 's' ? 4 : 6 },
      size: size === 's' ? 'xs' : size === 'l' ? 'l' : 'm',
      color: foregroundColor
    })
  }

  return (
    <TouchableOpacity
      style={[
        rounded && { borderRadius: 100 },
        style
      ]}
      alignItems="center"
      justifyContent="center"
      minWidth={theme.sizes[size]}
      height={theme.sizes[size]}
      paddingHorizontal={title ? size === 's' ? 'xm' : size === 'l' ? 'xl' : 'l' : 'none'}
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      borderRadius={borderRadius}
      borderWidth={size === 's' ? 1 : 2}
      opacity={disabled ? 0.6 : 1}
      disabled={!interactive || disabled || loading}
      activeOpacity={0.8}
      accessible={interactive}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      {...props}
    >
      <Animated.View style={[
        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
        contentContainerStyle,
        disabled && { opacity: 0.6 },
        { opacity: contentOpacity }
      ]}>
        {iconPlacement === 'left' && icon}

        {title != null && (
          <Text
            font="headingRegular"
            variant={size === 's' ? 'p4' : size === 'l' ? 'p2' : 'p3'}
            color={foregroundColor}
            style={titleStyle}
            numberOfLines={1}>
            {title}
          </Text>
        )}

        {iconPlacement === 'right' && icon}

        {children}
      </Animated.View>

      <Animated.View style={{ position: 'absolute', paddingTop: 2, opacity: indicatorOpacity }}>
        {(indicatorTransition || loading) && (
          <ActivityIndicator size={size === 's' ? 'small' : 'large'} color={foregroundColor} />
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}
