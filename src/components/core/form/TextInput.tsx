import React, { forwardRef, useCallback, useRef } from 'react'
import { View, TextInput as RNTextInput, Platform } from 'react-native'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { renderIcon } from 'helpers/ui'
import { InputContainer } from './common'
import { InputErrorIcon } from './InputErrorIcon'

export const TextInput = forwardRef(({
  type,
  style,
  inputContainerStyle,
  inputStyle,
  labelStyle,
  labelTextStyle,
  inline,
  center,
  label,
  placeholder,
  leftIcon,
  rightIcon,
  disabled,
  editable = !disabled,
  autoCorrect,
  keyboardType = autoCorrect === false && Platform.OS === 'android' ? 'visible-password' : undefined,
  hasError,
  onShowError,
  Input = RNTextInput,
  children,
  ...props
}, ref) => {
  const inputRef = useRef()
  const styles = useStyles(themedStyles)
  const theme = useTheme()

  const defaultInputProps = defaultInputPropsByType[type]

  const onInputRef = useCallback(el => {
    inputRef.current = el
    if (typeof ref === 'function') {
      ref(el)
    } else if (ref) {
      ref.current = el
    }
  }, [ref])

  if (leftIcon) {
    leftIcon = renderIcon(leftIcon, { color: theme.colors.textMuted, size: theme.fontSizes.l })
  }

  if (hasError) {
    rightIcon = <InputErrorIcon onPress={onShowError} />
  } else if (rightIcon) {
    rightIcon = renderIcon(rightIcon, { color: theme.colors.textMuted, size: theme.fontSizes.l })
  }

  return (
    <InputContainer
      style={style}
      labelStyle={labelStyle}
      labelTextStyle={labelTextStyle}
      inline={inline}
      label={label}
      disabled={disabled}
      onLabelPress={() => inputRef.current.focus()}>
      <View style={[styles.inputContainer, inline && { flex: 1 }, inputContainerStyle]}>
        <Input
          ref={onInputRef}
          style={[
            styles.input,
            inline && styles.inline,
            center && { textAlign: 'center' },
            leftIcon && !center && { paddingLeft: (inline ? theme.sizes.m - theme.spacing.m : theme.sizes.m) - 5 },
            rightIcon && !center && { paddingRight: (inline ? theme.sizes.m - theme.spacing.m : theme.sizes.m) - 5 },
            disabled && styles.disabled,
            inputStyle
          ]}
          placeholderTextColor={theme.colors.placeholder}
          placeholder={placeholder}
          editable={editable}
          autoCorrect={autoCorrect}
          keyboardType={keyboardType}
          accessible
          accessibilityLabel={typeof label === 'string' ? label : placeholder}
          keyboardAppearance={theme.keyboardAppearance}
          {...defaultInputProps}
          {...props} />

        {leftIcon && <View style={[styles.leftIconContainer, inline && { left: 0 }, center && { position: 'absolute' }]}>{leftIcon}</View>}
        {rightIcon && <View style={[styles.rightIconContainer, inline && { right: 0 }, center && { position: 'absolute' }]}>{rightIcon}</View>}
      </View>

      {children}
    </InputContainer>
  )
})

const defaultInputPropsByType = {
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
