import { useRef } from 'react'
import merge from 'lodash/merge'
import { IStateTreeNode, applySnapshot, getSnapshot } from 'mobx-state-tree'

export function mergeSnapshot(node: IStateTreeNode, mergeObj: object) {
  const currentSnapshot = getSnapshot(node)
  applySnapshot(node, merge({}, currentSnapshot, mergeObj))
}

/**
 * Preserves state when fast refresh causes the root store to change.
 */ 
export function useMSTFastRefresh(rootStore: IStateTreeNode) {
  const rootStoreRef = useRef(rootStore)

  if (rootStore !== rootStoreRef.current) {
    console.log('Root store changed. Applying previous snapshot.')
    const snapshot = getSnapshot(rootStoreRef.current)

    try {
      applySnapshot(rootStore, snapshot)
    } catch (error) {
      console.log(`Failed to apply previous snapshot: ${error}`)
    }
   
    rootStoreRef.current = rootStore
  }
}
