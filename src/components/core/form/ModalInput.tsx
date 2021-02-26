import React, { ReactNode } from 'react'
import {
  View,
  TouchableWithoutFeedback,
  Modal,
  StyleSheet,
  ModalProps
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Box } from '../common'

interface ModalInputProps extends ModalProps {
  children?: ReactNode
  onClose?: () => void
}

export function ModalInput({
  children,
  onClose = () => {},
  ...props
}: ModalInputProps) {
  return (
    <Modal
      animationType="slide"
      transparent
      onRequestClose={onClose}
      {...props}
    >
      <Box flex={1}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        
        <Box mt="auto" bg="modalInputBackground">
          <SafeAreaView>
            {children}
          </SafeAreaView>
        </Box>
      </Box>
    </Modal>
  )
}
