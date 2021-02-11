declare module 'mock-async-storage' {
  export default class MockAsyncStorage {
    store: {
      get(key: string): any,
      set(key: string, value: any): any
    }
  }
}
