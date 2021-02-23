import React, { ReactNode } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  ModalProps
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { createThemedStyleSheet, useStyles } from 'theme'

interface ModalInputProps extends ModalProps {
  children?: ReactNode
  onClose?: () => void
}

export function ModalInput({
  children,
  onClose = () => {},
  ...props
}: ModalInputProps) {
  const styles = useStyles(themedStyles)

  return (
    <Modal
      animationType="slide"
      transparent
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.modalInputOverlay}>
        <TouchableWithoutFeedback onPress={onClose}>
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
  modalInputOverlay: {
    flex: 1
  },
  modalInputContent: {
    marginTop: 'auto',
    backgroundColor: theme.colors.modalInputContent
  }
}))
