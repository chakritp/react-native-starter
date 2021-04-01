import { Instance, SnapshotIn, types, flow, onAction } from 'mobx-state-tree'
import migrateLocalStorage from 'lib/migrateLocalStorage'
import { LocalStorageSyncManager } from 'lib/mst'
import { localStorage } from 'services'
import { AppStore } from './AppStore'
import { AuthStore } from './AuthStore'
import localStorageMigrations from './localStorageMigrations'

const LOCAL_STORAGE_SCHEMA = {
  '/authStore/deviceRegistered': true,
  '/authStore/verificationToken': true,
  '/authStore/accessToken': true,
  '/authStore/user': true
}

export const RootStore = types
  .model({
    appStore: types.optional(AppStore, {}),
    authStore: types.optional(AuthStore, {})
  })
  .actions(self => {
    const localStorageSyncManager = new LocalStorageSyncManager(localStorage, LOCAL_STORAGE_SCHEMA)

    return {
      loadStoredState: flow(function*() {
        yield migrateLocalStorage({
          storage: localStorage,
          version: '1.0.0',
          migrations: localStorageMigrations
        })
        yield localStorageSyncManager.loadStoredState(self)
      }),
  
      initialize() {
        const disposers = Object.values(self).reduce((acc, child) => {
          if (child.initialize) {
            const disposer = child.initialize()
            if (disposer) {
              acc.push(disposer)
            }
          }
          return acc
        }, [] as Function[])
  
        localStorageSyncManager.startSync(self)
  
        if (__DEV__ && !global.test) {
          disposers.push(onAction(self, call => {
            console.log(`Action ${call.path}/${call.name}: `, call.args)
          }))
        }
  
        return () => {
          for (const disposer of disposers) {
            disposer()
          }
        }
      },
  
      reset() {
        for (const child of Object.values(self)) {
          if (child.reset) {
            child.reset()
          }
        }
      }
    }
  })

export interface IRootStore extends Instance<typeof RootStore> {}
export interface IRootStoreSnapshotIn extends SnapshotIn<typeof RootStore> {}
