import React, { Component, ComponentPropsWithRef, ComponentType, forwardRef } from 'react'
import {
  View,
  TextInput as $TextInput,
  TextInputProps as $TextInputProps,
  Platform,
  StyleProp,
  ViewStyle,
  TextStyle,
  NativeMethods
} from 'react-native'
import { useTheme } from '@shopify/restyle'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { IconProp, renderIcon } from 'helpers/ui'
import { Theme } from 'theme'
import { InputErrorIcon } from './InputErrorIcon'

const DEFAULT_INPUT_PROPS: { [key: string]: Partial<$TextInputProps> } = {
  email: {
    keyboardType: 'email-address',
    textContentType: 'emailAddress',
    autoCapitalize: 'none',
    autoCompleteType: 'email'
  },
  password: {
    secureTextEntry: true,
    textContentType: 'password',
    autoCapitalize: 'none',
    autoCorrect: false
  }
}

export interface TextInputProps extends Omit<$TextInputProps, 'style'> {
  type?: keyof typeof DEFAULT_INPUT_PROPS
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  embedded?: boolean
  center?: boolean
  leftIcon?: IconProp
  rightIcon?: IconProp
  disabled?: boolean
  hasError?: boolean
  Input?: ComponentType<ComponentPropsWithRef<typeof $TextInput>>
  onShowError?: () => void
}

export const TextInput = forwardRef<NativeMethods, TextInputProps>(({
  type,
  style,
  inputStyle,
  embedded,
  center,
  placeholder,
  leftIcon,
  rightIcon,
  disabled,
  editable = !disabled,
  autoCorrect,
  keyboardType = autoCorrect === false && Platform.OS === 'android' ? 'visible-password' : undefined,
  hasError,
  Input = $TextInput,
  onShowError,
  ...props
}: TextInputProps, ref: any) => {
  const styles = useThemedStyles(themedStyles)
  const theme = useTheme<Theme>()

  const defaultInputProps = type ? DEFAULT_INPUT_PROPS[type] : undefined

  if (leftIcon) {
    leftIcon = renderIcon(leftIcon, { color: 'inputForegroundMuted', size: 'l' })
  }

  if (hasError) {
    rightIcon = <InputErrorIcon onPress={onShowError} />
  } else if (rightIcon) {
    rightIcon = renderIcon(rightIcon, { color: 'inputForegroundMuted', size: 'l' })
  }

  return (
    <View style={[styles.container, style]}>
      <Input
        ref={ref}
        style={[
          styles.input,
          embedded && styles.embedded,
          center && { textAlign: 'center' },
          leftIcon && !center ? { paddingLeft: (embedded ? theme.sizes.m - theme.spacing.m : theme.sizes.m) - 5 } : null,
          rightIcon && !center ? { paddingRight: (embedded ? theme.sizes.m - theme.spacing.m : theme.sizes.m) - 5 } : null,
          disabled && styles.disabled,
          inputStyle
        ]}
        placeholderTextColor={theme.colors.inputForegroundSoft}
        placeholder={placeholder}
        editable={editable}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        accessible
        accessibilityLabel={placeholder}
        keyboardAppearance={theme.keyboardAppearance}
        {...defaultInputProps}
        {...props}
      />
      {leftIcon && <View style={[styles.leftIconContainer, embedded && { left: 0 }, center && { position: 'absolute' }]}>{leftIcon}</View>}
      {rightIcon && <View style={[styles.rightIconContainer, embedded && { right: 0 }, center && { position: 'absolute' }]}>{rightIcon}</View>}
    </View>
  )
})

const themedStyles = createThemedStyles((theme: Theme) => ({
  container: {
    flex: 1
  },
  input: {
    flex: 0,
    flexDirection: 'row',
    color: theme.colors.inputForegroundRegular,
    padding: theme.spacing.m,
    minHeight: theme.sizes.m,
    ...theme.fonts.bodyRegular,
    fontSize: theme.fontSizes.s,
    backgroundColor: theme.colors.inputBackgroundRegular,
    borderColor: theme.colors.inputBorderRegular,
    borderWidth: 1,
    borderRadius: theme.borderRadii.m
  },
  embedded: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    paddingHorizontal: 0
  },
  leftIconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: theme.spacing.m,
    justifyContent: 'center'
  },
  rightIconContainer: {
    position: 'absolute',
    top: 0,
    right: theme.spacing.m,
    bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  disabled: {
    opacity: 0.6
  }
}))
