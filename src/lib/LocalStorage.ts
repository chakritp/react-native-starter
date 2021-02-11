import AsyncStorage, { AsyncStorageStatic } from '@react-native-community/async-storage'

export default class LocalStorage {
  storage: AsyncStorageStatic

  constructor(storage = AsyncStorage) {
    this.storage = storage
  }

  async get(key: string) {
    const item: any = await this.storage.getItem(key)
    return JSON.parse(item)
  }

  async set(key: string, item: any) {
    if (item == null) {
      return this.storage.removeItem(key)
    }
    return this.storage.setItem(key, JSON.stringify(item))
  }

  async remove(key: string) {
    return this.storage.removeItem(key)
  }

  async multiGet(keys: string[]) {
    const kvPairs = await this.storage.multiGet(keys)
    return kvPairs.map((kv: [string, any]) => [kv[0], JSON.parse(kv[1])]) as [string, any][]
  }

  async multiSet(kvPairs: [string, any]) {
    const serializedPairs = kvPairs.map(([key, value]) => [key, JSON.stringify(value)])
    return this.storage.multiSet(serializedPairs)
  }

  async multiRemove(keys: string[]) {
    return this.storage.multiRemove(keys)
  }

  async getAllKeys() {
    return this.storage.getAllKeys()
  }

  async clear() {
    return this.storage.clear()
  }
}
