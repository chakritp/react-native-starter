import { PartialNavigationState } from 'components/core'
import { createRoot } from 'cosmos/helpers'

export default {
  Landing: createRoot(),
  SignUp: createRoot(() => ({
    navState: getNavState({ routes: [{ name: 'SignUp' }] })
  })),
  SignIn: createRoot(() => ({
    snapshot: {
      authStore: { deviceRegistered: true }
    }
  })),
  VerifyCode: createRoot(() => ({
    snapshot: {
      authStore: {
        phoneNumber: '+132316425489'
      }
    },
    navState: getNavState({ index: 1, routes: [{ name: 'SignUp' }, { name: 'VerifyCode' }] })
  })),
}

function getNavState(state: PartialNavigationState) {
  return {
    routes: [{
      name: 'Auth',
      state
    }]
  }
}
