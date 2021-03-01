import React from 'react'
import { ScrollContainer, Text } from 'components/core'
import { t } from 'helpers/i18n'

export const Updates = () => {
  return (
    <ScrollContainer center contentPadding="xxl">
      <Text variant="h1" textAlign="center">{t('screens.updates.title')}</Text>
    </ScrollContainer>
  )
}
