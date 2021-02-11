import React, { ReactNode, useEffect, useRef } from 'react'
import {
  Dimensions,
  View,
  KeyboardAvoidingView,
  ScrollViewProps,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ViewProps,
  StyleProp,
  ViewStyle
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/stack'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { IconProp, renderIcon } from 'helpers/ui'
import { Theme, ThemeSizeKey } from 'theme'
import { Text } from './Text'

type PaddingProp = ThemeSizeKey | number | boolean

interface PaddingProps {
  padding?: PaddingProp
  paddingHorizontal?: PaddingProp
  paddingVertical?: PaddingProp
}

export interface ContainerProps extends PaddingProps, ViewProps {
  center?: boolean
  keyboard?: boolean
  safe?: SafeAreaContentProps['safe']
  children?: ReactNode
}

export const Container = ({
  style,
  padding,
  paddingHorizontal,
  paddingVertical,
  center,
  keyboard,
  safe,
  children,
  ...props
}: ContainerProps) => {
  const theme = useTheme()
  const paddingStyle = getPaddingStyle(theme, { padding, paddingHorizontal, paddingVertical })

  if (keyboard) {
    children = (
      <View style={staticStyles.keyboardContainer}>
        {children}
      </View>
    )
  }

  return (
    <View
      style={[
        staticStyles.container,
        paddingStyle,
        center ? staticStyles.center : null,
        style
      ]}
      {...props}>
      {safe ? <SafeAreaContent safe={safe}>{children}</SafeAreaContent> : children}
    </View>
  )
}

export interface ScrollContainerProps extends ContainerProps, ScrollViewProps {
  refreshing?: boolean
  onRefresh?: () => void
}

export const ScrollContainer = ({
  style,
  contentContainerStyle,
  padding,
  paddingHorizontal,
  paddingVertical,
  center,
  keyboard,
  safe,
  refreshing,
  onRefresh,
  children,
  ...props
}: ScrollContainerProps) => {
  const theme = useTheme()
  const refreshRef = useRef(false)
  const paddingStyle = getPaddingStyle(theme, { padding, paddingHorizontal, paddingVertical })

  useEffect(() => {
    if (!refreshing) {
      refreshRef.current = false
    }
  }, [refreshing])

  if (keyboard) {
    children = (
      <View style={staticStyles.keyboardContainer}>
        {children}
      </View>
    )
  }

  return (
    <ScrollView
      style={[staticStyles.container, style]}
      contentContainerStyle={[
        paddingStyle,
        center && staticStyles.center,
        contentContainerStyle
      ]}
      refreshControl={onRefresh && (
        <RefreshControl
          refreshing={refreshRef.current && refreshing!}
          tintColor={theme.colors.textMuted}
          onRefresh={() => {
            refreshRef.current = true
            onRefresh()
          }} />
      )}
      {...props}>
      {safe ? <SafeAreaContent safe={safe}>{children}</SafeAreaContent> : children}
    </ScrollView>
  )
}

export const KeyboardAvoidingContainer = ({ style, ...props }: ViewProps) => {
  const headerHeight = useHeaderHeight()
  return (
    <KeyboardAvoidingView
      style={[
        staticStyles.container,
        style
      ]}
      keyboardVerticalOffset={headerHeight}
      behavior="padding"
      {...props} />
  )
}

export interface HeadingProps {
  style?: StyleProp<ViewStyle>
  icon?: IconProp
  title?: string
  subtitle?: string
  children?: ReactNode
}

export const Heading = ({ style, icon, title, subtitle, children }: HeadingProps) => {
  const styles = useStyles(themedStyles)
  return (
    <View style={[styles.heading, style]}>
      {icon && (
        <View style={styles.headingIconContainer}>
          {renderIcon(icon, { size: 84 })}
        </View>
      )}
      {title ? <Text.H1 style={styles.headingTitle}>{title}</Text.H1> : null}
      {subtitle ? <Text.S3 style={styles.headingSubtitle}>{subtitle}</Text.S3> : null}
      {children}
    </View>
  )
}

export interface SafeAreaContentProps {
  safe?: boolean | 'top' | 'bottom'
  children?: ReactNode
}

const SafeAreaContent = ({ safe = true, children }: SafeAreaContentProps) => {
  const insets = useSafeAreaInsets()
  const containerStyle: any = { flex: 1 }
  
  if (safe === true || safe === 'top') {
    containerStyle.paddingTop = insets.top
  }
  if (safe === true || safe === 'bottom') {
    containerStyle.paddingBottom = insets.bottom
  }

  return (
    <View style={containerStyle}>
      {children}
    </View>
  )
}

const staticStyles = StyleSheet.create({
  container: {
    flex: 1
  },
  keyboardContainer: {
    marginBottom: Math.round(Dimensions.get('window').height * 0.33)
  },
  center: {
    flexGrow: 1,
    justifyContent: 'center'
  }
})

const themedStyles = createThemedStyleSheet(theme => ({
  heading: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl
  },
  headingIconContainer: {
    marginBottom: theme.spacing.xl
  },
  headingTitle: {
    textAlign: 'center'
  },
  headingSubtitle: {
    textAlign: 'center',
    marginTop: theme.spacing.l,
    lineHeight: theme.spacing.l * 1.7,
  }
}))

function getPaddingStyle(theme: Theme, props: PaddingProps) {
  const style: any = {}

  for (let [key, value] of Object.entries(props)) {
    if (value === true) {
      style[key] = theme.spacing.l
    } else if (value) {
      style[key] = typeof value === 'string' ? theme.spacing[value as ThemeSizeKey] : theme
    }
  }

  return style as StyleProp<ViewStyle>
}
