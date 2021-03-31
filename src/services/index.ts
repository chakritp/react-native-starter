import LocalStorage from 'lib/LocalStorage'
import RootNavigation from 'lib/RootNavigation'

export { default as api } from './api'

export const localStorage = new LocalStorage()

export const rootNavigation = new RootNavigation()
