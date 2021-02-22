import React, { forwardRef } from 'react'
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
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { IconProp, renderIcon } from 'helpers/ui'
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
  inline?: boolean
  center?: boolean
  leftIcon?: IconProp
  rightIcon?: IconProp
  disabled?: boolean
  hasError?: boolean
  Input?: typeof $TextInput
  onShowError?: () => void
}

export const TextInput = forwardRef<NativeMethods, TextInputProps>(({
  type,
  style,
  inputStyle,
  inline,
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
  const styles = useStyles(themedStyles)
  const theme = useTheme()

  const defaultInputProps = type ? DEFAULT_INPUT_PROPS[type] : undefined

  if (leftIcon) {
    leftIcon = renderIcon(leftIcon, { color: theme.colors.textMuted, size: theme.fontSizes.l })
  }

  if (hasError) {
    rightIcon = <InputErrorIcon onPress={onShowError} />
  } else if (rightIcon) {
    rightIcon = renderIcon(rightIcon, { color: theme.colors.textMuted, size: theme.fontSizes.l })
  }

  return (
    <View style={[styles.inputContainer, inline && { flex: 1 }, style]}>
      <Input
        ref={ref}
        style={[
          styles.input,
          inline && styles.inline,
          center && { textAlign: 'center' },
          leftIcon && !center ? { paddingLeft: (inline ? theme.sizes.m - theme.spacing.m : theme.sizes.m) - 5 } : null,
          rightIcon && !center ? { paddingRight: (inline ? theme.sizes.m - theme.spacing.m : theme.sizes.m) - 5 } : null,
          disabled && styles.disabled,
          inputStyle
        ]}
        placeholderTextColor={theme.colors.placeholder}
        placeholder={placeholder}
        editable={editable}
        autoCorrect={autoCorrect}
        keyboardType={keyboardType}
        accessible
        accessibilityLabel={placeholder}
        keyboardAppearance={theme.keyboardAppearance as TextInputProps['keyboardAppearance']}
        {...defaultInputProps}
        {...props} />

      {leftIcon && <View style={[styles.leftIconContainer, inline && { left: 0 }, center && { position: 'absolute' }]}>{leftIcon}</View>}
      {rightIcon && <View style={[styles.rightIconContainer, inline && { right: 0 }, center && { position: 'absolute' }]}>{rightIcon}</View>}
    </View>
  )
})

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    flex: 1
  },
  containerInline: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputContainer: {
    width: '100%'
  },
  input: {
    flex: 0,
    flexDirection: 'row',
    color: theme.colors.inputText,
    padding: theme.spacing.m,
    minHeight: theme.sizes.m,
    ...theme.fonts.bodyRegular,
    fontSize: theme.fontSizes.s,
    backgroundColor: theme.colors.inputBg,
    borderColor: theme.colors.inputBorder,
    borderWidth: 1,
    borderRadius: theme.radii.m
  },
  inline: {
    flex: 1,
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
