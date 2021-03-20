import React, { ReactNode, useEffect, useRef } from 'react'
import {
  Dimensions,
  View,
  KeyboardAvoidingView,
  ScrollViewProps,
  ScrollView,
  RefreshControl,
  StyleSheet
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useHeaderHeight } from '@react-navigation/stack'
import {
  spacing,
  backgroundColor,
  boxRestyleFunctions,
  useRestyle,
  useTheme
} from '@shopify/restyle'
import { IconProp, renderIcon } from 'helpers/ui'
import { Theme } from 'theme'
import { Box, BoxProps } from './common'
import { Text } from './Text'

export interface ContainerProps extends BoxProps {
  center?: boolean
  keyboard?: boolean
  safe?: SafeAreaProps['safe']
}

export const Container = ({
  style,
  center,
  keyboard,
  safe,
  children,
  ...props
}: ContainerProps) => {

  if (keyboard) {
    children = (
      <View style={{ marginBottom: Math.round(Dimensions.get('window').height * 0.33) }}>
        {children}
      </View>
    )
  }

  return (
    <Box
      flex={1}
      style={[
        center ? styles.center : null,
        style
      ]}
      {...props}>
      {safe ? <SafeArea safe={safe}>{children}</SafeArea> : children}
    </Box>
  )
}

export interface ScrollContainerProps extends ContainerProps, ScrollViewProps {
  contentPadding?: BoxProps['padding']
  contentPaddingTop?: BoxProps['paddingTop']
  contentPaddingRight?: BoxProps['paddingRight']
  contentPaddingBottom?: BoxProps['paddingBottom']
  contentPaddingLeft?: BoxProps['paddingLeft'] 
  contentPaddingHorizontal?: BoxProps['paddingHorizontal']
  contentPaddingVertical?: BoxProps['paddingVertical']
  contentBackgroundColor?: BoxProps['backgroundColor']
  refreshing?: boolean
  onRefresh?: () => void
}

export const ScrollContainer = ({
  contentContainerStyle,
  contentPadding,
  contentPaddingTop,
  contentPaddingRight,
  contentPaddingBottom,
  contentPaddingLeft,
  contentPaddingHorizontal,
  contentPaddingVertical,
  contentBackgroundColor,
  flex = 1,
  center,
  keyboard,
  safe,
  refreshing,
  onRefresh,
  children,
  ...props
}: ScrollContainerProps) => {
  const refreshRef = useRef(false)
  const theme = useTheme<Theme>()

  const containerProps = useRestyle(boxRestyleFunctions, { ...props, flex })

  const { style: baseContentContainerStyle } = useRestyle([spacing, backgroundColor], {
    padding: contentPadding,
    paddingTop: contentPaddingTop,
    paddingRight: contentPaddingRight,
    paddingBottom: contentPaddingBottom,
    paddingLeft: contentPaddingLeft,
    paddingHorizontal: contentPaddingHorizontal,
    paddingVertical: contentPaddingVertical,
    backgroundColor: contentBackgroundColor,
  }) as { style: ScrollContainerProps['contentContainerStyle'] }

  useEffect(() => {
    if (!refreshing) {
      refreshRef.current = false
    }
  }, [refreshing])

  if (keyboard) {
    children = (
      <View style={{ marginBottom: Math.round(Dimensions.get('window').height * 0.33) }}>
        {children}
      </View>
    )
  }

  return (
    <ScrollView
      {...containerProps}
      contentContainerStyle={[
        baseContentContainerStyle,
        center ? styles.center : null,
        contentContainerStyle
      ]}
      refreshControl={onRefresh && (
        <RefreshControl
          refreshing={refreshRef.current && refreshing!}
          tintColor={theme.colors.mainForegroundMuted}
          onRefresh={() => {
            refreshRef.current = true
            onRefresh()
          }} />
      )}>
      {safe ? <SafeArea safe={safe}>{children}</SafeArea> : children}
    </ScrollView>
  )
}

export const KeyboardAvoidingContainer = ({ children, ...props }: BoxProps) => {
  const headerHeight = useHeaderHeight()
  const { style } = useRestyle(boxRestyleFunctions, { flex: 1, ...props }) as any
  return (
    <KeyboardAvoidingView
      style={style}
      keyboardVerticalOffset={headerHeight}
      behavior="padding"
    >
      {children}
    </KeyboardAvoidingView>
  )
}

export interface HeadingProps extends BoxProps {
  icon?: IconProp
  title?: string | ReactNode
  subtitle?: string | ReactNode
  children?: ReactNode
}

export const Heading = ({ icon, title, subtitle, children, ...props }: HeadingProps) => {
  const theme = useTheme<Theme>()

  return (
    <Box mb="xxl" alignItems="center" {...props}>
      {icon && (
        <Box mb="xl">
          {renderIcon(icon, { size: 84 })}
        </Box>
      )}
      {title ? <Text variant="h1" textAlign="center">{title}</Text> : null}
      {subtitle ? <Text variant="s3" textAlign="center" mt="l" lineHeight={theme.spacing.xl}>{subtitle}</Text> : null}
      {children}
    </Box>
  )
}

export interface SafeAreaProps {
  safe?: boolean | 'top' | 'bottom'
  children?: ReactNode
}

export const SafeArea = ({ safe = true, children }: SafeAreaProps) => {
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

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    justifyContent: 'center'
  }
})
