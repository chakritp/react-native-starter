import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'lib/mst'
import { createStackNavigator } from 'components/core'
import { Landing } from './Landing'
import { SignIn } from './SignIn'
import { VerifyCode } from './VerifyCode'

const Stack = createStackNavigator()

export const Auth = observer(() => {
  const {
    authStore: { hasRegistered }
  } = useStore()  

  return (
    <Stack.Navigator
      initialRouteName={hasRegistered ? 'SignIn' : 'Landing'}
      screenOptions={{ headerTransparent: true }}
    >
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="VerifyCode" component={VerifyCode} />
    </Stack.Navigator>
  )
})
