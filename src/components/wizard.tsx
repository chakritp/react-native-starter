import React from 'react'
import { StyleSheet } from 'react-native'
import { useHeaderHeight } from '@react-navigation/stack'
import {
  Box,
  BoxProps,
  ScrollContainer,
  ScrollContainerProps,
  Text,
  Button,
  ButtonProps,
  useFormContext
} from 'components/core'
import { t } from 'helpers/i18n'

export const WizardContainer = ({
  contentContainerStyle,
  keyboard = true,
  children,
  ...props
}: ScrollContainerProps) => {
  const headerHeight = useHeaderHeight()
  
  return (
    <ScrollContainer
      center
      keyboard={keyboard}
      keyboardShouldPersistTaps="handled"
      contentPaddingHorizontal="xxl"
      contentPaddingVertical="xxl"
      contentContainerStyle={[
        { paddingTop: headerHeight },
        contentContainerStyle
      ]}
      {...props}
    >
      {children}
    </ScrollContainer>
  )
}

export interface SectionHeaderProps extends BoxProps {
  title: string
}

export const SectionHeader = ({ title, ...props }: SectionHeaderProps) => (
  <Box
    mt="l"
    mb="xxl"
    borderColor="mainBorderRegular"
    borderBottomWidth={StyleSheet.hairlineWidth}
    {...props}
  >
    <Text variant="p2" mb="m">
      {title}
    </Text>
  </Box>
)

export const SubmitButton = ({ title = t('actions.submit'), ...props }: ButtonProps) => {
  const form = useFormContext()
  return (
    <Button
      mt="l"
      mb="xl"
      title={title}
      loading={form && form.formState.isSubmitting}
      onPress={form && form.submit}
      {...props} />
  )
}

export const SecondaryButton = (props: ButtonProps) => (
  <Button
    variant="secondary"
    size="s"
    alignSelf="center"
    minWidth="40%"
    mb="l"
    {...props} />
)
