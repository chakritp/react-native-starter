import React from 'react'
import { ScrollContainer, Text } from 'components/core'
import { t } from 'helpers/i18n'

export const Landing = () => {
  return (
    <ScrollContainer center contentPadding="xxl">
      <Text variant="h1">{t('terms.brand')}</Text>
    </ScrollContainer>
  )
}
