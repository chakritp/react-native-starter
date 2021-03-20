import React from 'react'
import { Box, ScrollContainer, Text, Button } from 'components/core'
import { t } from 'helpers/i18n'
import { AuthScreenProps } from 'screens/types'

export const Landing = ({ navigation }: AuthScreenProps<'Landing'>) => {
  return (
    <ScrollContainer center contentPadding="xxl">
      <Box padding="xl" mb="xxxl" borderColor="mainBorderRegular" borderWidth={2} borderRadius="xl">
        <Text variant="h1" textAlign="center">{t('terms.brand')}</Text>
      </Box>
      <Button
        alignSelf="center"
        paddingRight="m"
        title={t('actions.getStarted')}
        size="l"
        icon={{ name: 'chevron-right', size: "xl" }}
        iconPlacement="right"
        onPress={() => navigation.replace('SignIn')} />
    </ScrollContainer>
  )
}
