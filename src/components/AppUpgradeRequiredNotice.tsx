import React from 'react'
import { View, Platform, Linking } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Container, Heading, Button } from 'components/core'
import { useTranslate } from 'helpers/i18n'

export const AppUpgradeRequiredNotice = () => {
  const styles = useStyles(themedStyles)
  const t = useTranslate('screens.appUpdateRequired')

  const goToAppStore = () => {
    const url = Platform.select({
      ios: 'http://appstore.com/checkingcash',
      android: `http://play.google.com/store/apps/details?id=${DeviceInfo.getBundleId()}`
    })
    Linking.openURL(url!)
  }
  
  return (
    <Container
      style={styles.container}
    >
      <View>
        <Heading
          icon="warning"
          title={t('title')}
          subtitle={t('subtitle', {
            brand: t('terms.brand'),
            store: t(`terms.appStore.${Platform.OS}`)
          })} />

        <Button
          style={{ marginTop: 24 }}
          title={t('goToAppStore', {
            store: t(`terms.appStore.${Platform.OS}`)
          })}
          onPress={goToAppStore} />
      </View>
    </Container>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
    paddingBottom: theme.spacing.xxl * 2,
    backgroundColor: theme.colors.containerBg,
  }
}))
