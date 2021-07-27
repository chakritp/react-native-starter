import { PartialNavigationState } from 'components/core'
import { createRoot } from 'cosmos/helpers'

export default {
  Landing: createRoot(),
  SignIn: createRoot(() => ({
    navState: getNavState({ routes: [{ name: 'SignIn' }] })
  })),
  Verify: createRoot(() => ({
    snapshot: {
      authStore: {
        email: 'tester@test.com',
        verificationToken: 'test-token'
      }
    },
    navState: getNavState({ index: 1, routes: [{ name: 'SignIn' }, { name: 'Verify' }] })
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
