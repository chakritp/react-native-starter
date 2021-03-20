import { PartialNavigationState } from 'components/core'
import { createRoot } from 'cosmos/helpers'

export default {
  Landing: createRoot(),
  SignIn: createRoot(() => ({
    snapshot: {
      authStore: { deviceRegistered: true }
    }
  })),
  VerifyCode: createRoot(() => ({
    snapshot: {
      authStore: {
        email: 'tester@iterate.co'
      }
    },
    navState: getNavState({ index: 1, routes: [{ name: 'VerifyCode' }] })
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
