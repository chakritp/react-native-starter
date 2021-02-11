import {
  CommonActions,
  NavigationContainerRef,
  NavigationAction
} from '@react-navigation/native'

export default class RootNavigation {
  navigator: NavigationContainerRef | null = null

  setNavigator(navigator: NavigationContainerRef | null) {
    this.navigator = navigator
  }

  reset(...args: Parameters<typeof CommonActions.reset>) {
    this.dispatch(CommonActions.reset(...args))
  }

  navigate(...args: Parameters<typeof CommonActions.navigate>) {
    this.dispatch(CommonActions.navigate(...args))
  }

  goBack(...args: Parameters<typeof CommonActions.goBack>) {
    this.dispatch(CommonActions.goBack(...args))
  }

  dispatch(action: NavigationAction) {
    this.navigator!.dispatch(action)
  }
}
