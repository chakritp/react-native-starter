import { createRoot } from "cosmos/helpers"

const routes = [
  { name: 'MainMenu' },
]

export default {
  MainMenu: createRoot(() => ({ navState: getNavState('MainMenu') }))
}

function getNavState(routeName: string) {
  const index = routes.findIndex(r => r.name === routeName)

  return {
    routes: [{
      name: 'Main',
      state: {
        routes: [
          {
            name: 'Settings',
            state: {
              index,
              routes: routes.slice(0, index + 1)
            }
          },
        ]
      }
    }]
  }
}
