import { IJsonPatch, IStateTreeNode, applyPatch, resolvePath, onPatch } from 'mobx-state-tree'
import LocalStorage from '../LocalStorage'

export class LocalStorageSyncManager {
  localStorage: LocalStorage
  schema: { [key: string]: boolean }

  constructor(localStorage: LocalStorage, schema: LocalStorageSyncManager['schema']) {
    this.localStorage = localStorage
    this.schema = schema
  }

  async loadStoredState(node: IStateTreeNode) {
    const kvPairs = await this.localStorage.multiGet(Object.keys(this.schema))

    if (__DEV__ && !global.test) {
      console.log(`Applying stored state:\n${JSON.stringify(mapKvPairs(kvPairs), null, 2)}`)
    }

    const patches = kvPairs.reduce((acc, [path, value]) => {
      if (value !== null) {
        acc.push({ op: 'replace', path, value })
      }
      return acc
    }, [] as IJsonPatch[])

    applyPatch(node, patches)
  }

  startSync(node: IStateTreeNode) {
    let buffering = false
    let storagePathMap: { [key: string]: boolean } = {}

    return onPatch(node, patch => {
      const storagePath = patch.path.split('/').slice(0, 3).join('/')
      
      if (this.schema[storagePath] && !storagePathMap[storagePath]) {
        storagePathMap[storagePath] = true

        if (!buffering) {
          buffering = true

          requestAnimationFrame(() => {
            const storageOps = Object.keys(storagePathMap).reduce((acc, path) => {
              const value = resolvePath(node, path)
              if (value != null) {
                acc.set.push([path, value])
              } else {
                acc.remove.push(path)
              }
              return acc
            }, { set: [], remove: [] } as any)
            
            if (storageOps.set.length) {
              try {
                this.localStorage.multiSet(storageOps.set)
                // if (__DEV__) {
                //   console.log(`Saving values to local storage:\n${JSON.stringify(mapKvPairs(storageOps.set), null, 2)}`)
                // }
              } catch (error) {
                console.warn(`Failed to set local storage values: ${error}\n`, storageOps.set)
              }
            }

            if (storageOps.remove.length) {
              try {
                this.localStorage.multiRemove(storageOps.remove)
                // if (__DEV__) {
                //   console.log(`Removing values from local storage:\n${JSON.stringify(storageOps.remove, null, 2)}`)
                // }
              } catch (error) {
                console.warn(`Failed to remove local storage keys: ${error}\n`, storageOps.remove)
              }
            }
            
            buffering = false
            storagePathMap = {}
          })
        }
      }
    })
  }
}

function mapKvPairs(kvPairs: [string, any][]) {
  return kvPairs.reduce((acc, [key, val]) => {
    acc[key] = val
    return acc
  }, {} as { [key: string]: any })
}
