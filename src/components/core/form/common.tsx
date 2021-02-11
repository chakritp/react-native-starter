import noop from 'lodash/noop'
import React from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
  StyleSheet
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { renderIcon } from 'helpers/ui'
import { Button } from '../Button'
import { Label } from './Label'

export function InputContainer({
  style,
  inline,
  disabled,
  label,
  labelStyle,
  labelTextStyle,
  children,
  onLabelPress
}) {
  const styles = useStyles(themedStyles)
  return (
    <View style={[inline && styles.inputContainerInline, style]}>
      {renderLabel(label, { inline, style: labelStyle, textStyle: labelTextStyle, disabled, onPress: onLabelPress })}
      {children}
    </View>
  )
}

export function renderLabel(label, props) {
  return label && <Label {...props}>{label}</Label>
}

export function ButtonInput({
  style,
  titleStyle,
  inline,
  placeholder,
  value,
  disabled,
  icon,
  onPress,
  ...props
}) {
  const theme = useTheme()
  const styles = useStyles(themedStyles)
  const hasValue = value != null && value !== ''

  if (!inline && !icon) {
    icon = "arrow-drop-down"
  }

  return (
    <Button
      transparent
      style={style}
      contentStyle={[styles.buttonInput, inline && styles.buttonInputInline]}
      titleContainerStyle={[styles.buttonInputTitleContainer, icon && { paddingRight: theme.spacing.m }]}
      titleStyle={[hasValue ? styles.buttonInputValue : styles.buttonInputPlaceholder, titleStyle]}
      title={hasValue ? value : placeholder}
      accessibilityLabel={placeholder}
      disabled={disabled}
      onPress={!disabled ? (() => {
        Keyboard.dismiss()
        onPress()
      }) : undefined}
      icon={icon && (
        <View style={styles.buttonInputIconContainer}>
          {renderIcon(icon, { style: { lineHeight: theme.fontSizes.l * 0.84 }, size: theme.fontSizes.l, color: 'placeholder' })}
        </View>
      )}
      {...props} />
  )
}

ButtonInput.defaultProps = {
  onPress: noop
}

export function ModalInput({
  visible,
  children,
  onClose = () => {},
  ...props
}) {
  const styles = useStyles(themedStyles)

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.modalInputOverlay}>
        <TouchableWithoutFeedback
          onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        
        <View style={styles.modalInputContent}>
          <SafeAreaView>
            {children}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  inputContainerInline: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  disabled: {
    opacity: 0.6
  },
  buttonInput: {
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.m,
    backgroundColor: theme.colors.inputBg,
    borderRadius: theme.radii.m
  },
  buttonInputInline: {
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0
  },
  buttonInputTitleContainer: {
    justifyContent: 'flex-start',
    width: '100%'
  },
  buttonInputPlaceholder: {
    color: theme.colors.placeholder
  },
  buttonInputValue: {
    color: theme.colors.inputText
  },
  buttonInputIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  modalInputOverlay: {
    flex: 1
  },
  modalInputContent: {
    marginTop: 'auto',
    backgroundColor: theme.colors.modalInputContent
  }
}))
