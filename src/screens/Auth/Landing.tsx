import React from 'react'
import { Box, ScrollContainer, Text } from 'components/core'
import { t } from 'helpers/i18n'

export const Landing = () => {
  return (
    <ScrollContainer center contentPadding="xxl">
      <Box padding="xl" borderColor="mainBorderRegular" borderWidth={2} borderRadius="xl">
        <Text variant="h1" textAlign="center">{t('terms.brand')}</Text>
      </Box>
    </ScrollContainer>
  )
}
