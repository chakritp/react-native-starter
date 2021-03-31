import { createRoot } from 'cosmos/helpers'

export default createRoot(() => ({
  snapshot: {
    appStore: {
      upgradeRequired: true
    }
  }
}))
