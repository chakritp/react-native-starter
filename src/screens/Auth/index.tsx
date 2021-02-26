import React from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'lib/mst'
import { createStackNavigator } from 'components/navigation'
import { Landing } from './Landing'
import { SignUp } from './SignUp'
import { SignIn } from './SignIn'

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
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={SignIn} />
    </Stack.Navigator>
  )
})
