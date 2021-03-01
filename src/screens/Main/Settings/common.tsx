import React from 'react'
import {
  KeyboardAvoidingContainer,
  ScrollContainer,
  ScrollContainerProps
} from 'components/core'

export const SettingsContainer = (props: ScrollContainerProps) => {
  return (
    <KeyboardAvoidingContainer>
      <ScrollContainer bg="mainBackgroundSoft" {...props} />
    </KeyboardAvoidingContainer>
  )
}
