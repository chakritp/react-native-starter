import React from 'react'
import { View, Keyboard } from 'react-native'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { renderIcon } from 'helpers/ui'
import { Button, ButtonProps } from '../Button'

interface PickerButtonProps extends ButtonProps {
  embedded?: boolean
  placeholder?: string
  value?: any
}

export function PickerButton({
  style,
  titleStyle,
  embedded,
  placeholder,
  value,
  disabled,
  icon,
  onPress = () => {},
  ...props
}: PickerButtonProps) {
  const theme = useTheme()
  const styles = useStyles(themedStyles)
  const hasValue = value != null && value !== ''

  if (icon === undefined && !embedded) {
    icon = "arrow-drop-down"
  }

  return (
    <Button
      style={[{ flex: 1 }, style]}
      contentStyle={[styles.content, embedded && styles.contentEmbedded]}
      titleContainerStyle={[styles.titleContainer, icon ? { paddingRight: theme.spacing.m } : null]}
      titleStyle={[hasValue ? styles.value : styles.placeholder, titleStyle]}
      title={hasValue ? String(value) : placeholder}
      accessibilityLabel={placeholder}
      disabled={disabled}
      onPress={!disabled ? ((ev) => {
        Keyboard.dismiss()
        onPress(ev)
      }) : undefined}
      icon={icon && (
        <View style={styles.iconContainer}>
          {renderIcon(icon, { size: theme.fontSizes.l, color: 'placeholder' })}
        </View>
      )}
      {...props} />
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  content: {
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.inputBg,
    borderRadius: theme.radii.m
  },
  contentEmbedded: {
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0
  },
  titleContainer: {
    justifyContent: 'flex-start',
    width: '100%'
  },
  placeholder: {
    color: theme.colors.placeholder
  },
  value: {
    color: theme.colors.inputText
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'center'
  }
}))
