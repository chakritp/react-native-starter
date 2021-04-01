import React from 'react'
import { Linking } from 'react-native'
import { observer } from 'mobx-react-lite'
import { useStore } from 'lib/mst'
import { TERMS_OF_SERVICE_URL, PRIVACY_POLICY_URL } from 'config'
import { ListSection, ListItem } from 'components/core'
import { scopedTranslate } from 'helpers/i18n'
import { SettingsScreenProps } from 'screens/types'
import { SettingsContainer } from './common'

export const MainMenu = observer(({ navigation: { navigate: _ } }: SettingsScreenProps<'MainMenu'>) => {
  const { authStore: { signOut } } = useStore()
  const t = scopedTranslate('screens.settings')
  

  return (
    <SettingsContainer>
      <ListSection title={t('account.title')}>
        <ListItem
          title={t('actions.signOut')}
          leftIcon="exit-to-app"
          onPress={signOut} />
      </ListSection>

      <ListSection title={t('help.title')}>
        <ListItem
          title={t('help.tos')}
          leftIcon="article"
          onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)} />

        <ListItem
          title={t('help.privacyPolicy')}
          leftIcon="privacy-tip"
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)} />
      </ListSection>
    </SettingsContainer>
  )
})
