import LocalStorage from 'lib/LocalStorage'
import RootNavigation from './RootNavigation'

export * from './api'

export const localStorage = new LocalStorage()

export const rootNavigation = new RootNavigation()
