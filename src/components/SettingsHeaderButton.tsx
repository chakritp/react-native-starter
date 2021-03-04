import React  from 'react'
import { useNavigation } from '@react-navigation/native'
import { HeaderButton, ButtonProps } from 'components/core'
import { t } from 'helpers/i18n'

export const SettingsHeaderButton = (props: ButtonProps) => {
  const navigation = useNavigation()
  return (
    <HeaderButton
      paddingHorizontal="m"
      icon={{ name: 'settings', size: 28 }}
      accessibilityLabel={t('screens.settings.title')}
      accessibilityRole="link"
      onPress={() => navigation.navigate('Settings')}
      {...props} />
  )
}
