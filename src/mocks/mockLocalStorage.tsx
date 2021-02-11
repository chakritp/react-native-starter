import merge from 'lodash/merge'
import MockAsyncStorage from 'mock-async-storage'
import { localStorage } from 'services'

export function mockLocalStorage() {
  const { storage } = localStorage
  const mockStorage = new MockAsyncStorage()
  localStorage.storage = mockStorage as any

  mockStorage.store.set('_version', '9999999')

  return {
    set(key: string, value: any) {
      mockStorage.store.set(key, JSON.stringify(value))
      return this
    },
    merge(key: string, value: any) {
      const json = mockStorage.store.get(key)
      if (!json) {
        return this.set(key, value)
      }
      return this.set(key, merge(JSON.parse(json), value))
    },
    unmock() {
      localStorage.storage = storage
    }
  }
}
