import { rootNavigation } from 'services'
import { mockLocalStorage } from 'mocks'

export const localStorageMock = mockLocalStorage()

export function getCurrentRoute() {
  return rootNavigation.navigator?.getCurrentRoute()
}

export function getCurrentRouteName() {
  return getCurrentRoute()?.name
}
