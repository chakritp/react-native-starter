export * from './createStackNavigator'

export interface PartialNavigationRoute {
  name: string,
  params?: { [key: string ]: any }
  state?: PartialNavigationState
}

export interface PartialNavigationState {
  index?: number,
  routes: PartialNavigationRoute[]
}
