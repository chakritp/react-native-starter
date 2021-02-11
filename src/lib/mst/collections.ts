import { types, applySnapshot } from 'mobx-state-tree'

export function createCollection(modelClass: any) {
  return types
    .model({
      records: types.array(types.safeReference(modelClass, { acceptsUndefined: false })),
      page: types.optional(types.number, 0),
      total: types.optional(types.number, 0)
    })
    .views(self => {
      return {
        get loaded() {
          return self.page > 0
        }
      }
    })
    .actions(self => {
      return {
        reset() {
          applySnapshot(self, {})
        }
      }
    })
}
