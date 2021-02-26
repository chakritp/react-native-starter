import React  from 'react'
import { useNavigation } from '@react-navigation/native'
import { HeaderButton, ButtonProps } from 'components/core'

export const SettingsHeaderButton = (props: ButtonProps) => {
  const navigation = useNavigation()
  return (
    <HeaderButton
      paddingHorizontal="m"
      icon={{ name: 'settings', size: 28 }}
      onPress={() => navigation.navigate('Settings')}
      {...props} />
  )
}
