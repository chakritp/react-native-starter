import React from 'react'
import {  Platform, Linking } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { Box, Container, Heading, Button } from 'components/core'
import { scopedTranslate } from 'helpers/i18n'

export const AppUpgradeRequired = () => {
  const t = scopedTranslate('screens.appUpgradeRequired')

  const goToAppStore = () => {
    const url = Platform.select({
      ios: 'http://appstore.com/typescriptstarter',
      android: `http://play.google.com/store/apps/details?id=${DeviceInfo.getBundleId()}`
    })
    Linking.openURL(url!)
  }
  
  return (
    <Container
      height="100%"
      justifyContent="center"
      padding="xxl"
      paddingBottom="xxxl"
      bg="mainBackgroundRegular"
    >
      <Box>
        <Heading
          icon={{ name: "warning", color: "warningHeavy" }}
          title={t('title')}
          subtitle={t('subtitle', {
            brand: t('terms.brand'),
            store: t(`terms.appStore.${Platform.OS}`)
          })} />

        <Button
          mt="xl"
          alignSelf="center"
          title={t('goToAppStore', {
            store: t(`terms.appStore.${Platform.OS}`)
          })}
          onPress={goToAppStore} />
      </Box>
    </Container>
  )
}
