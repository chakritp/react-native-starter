import React from 'react'
import { View, Keyboard } from 'react-native'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { Theme } from 'theme'
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
  icon = 'arrow-drop-down',
  onPress = () => {},
  ...props
}: PickerButtonProps) {
  const styles = useThemedStyles(themedStyles)
  const hasValue = value != null && value !== ''

  return (
    <Button
      variant="input"
      flex={1}
      paddingLeft="m"
      paddingRight={icon ? 'xs' : 'm'}
      style={[embedded && styles.containerEmbedded, style]}
      contentContainerStyle={styles.contentContainer}
      titleStyle={[!hasValue && styles.placeholder, titleStyle]}
      title={hasValue ? String(value) : placeholder}
      accessibilityLabel={placeholder}
      disabled={disabled}
      onPress={!disabled ? ((ev) => {
        Keyboard.dismiss()
        onPress(ev)
      }) : undefined}
      icon={icon && renderIcon(icon, { size: 'l', color: 'inputForegroundSoft', position: 'absolute', right: 0 })}
      iconPlacement="right"
      {...props} />
  )
}

const themedStyles = createThemedStyles((theme: Theme) => ({
  containerEmbedded: {
    paddingLeft: 0,
    paddingRight: 0,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0
  },
  contentContainer: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%'
  },
  placeholder: {
    color: theme.colors.inputForegroundSoft
  }
}))
