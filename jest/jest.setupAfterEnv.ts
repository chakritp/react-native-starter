import '@testing-library/jest-native/extend-expect.js'
import { AppState, AppStateStatic, AppStateStatus, Linking } from 'react-native'

interface EventEmitter {
  addEventListener(type: string, handler: (...args: any[]) => void): void
  removeEventListener(type: string, handler: (...args: any[]) => void): void
  emit(type: string, ...args: any[]): void
}

declare module 'react-native' {
  interface AppStateStatic extends EventEmitter {
    change(state: AppStateStatus): void
  }
}

function mockEventEmitter(object: EventEmitter) {
  let listeners: any[] = []
  object.addEventListener = (type, handler) => {
    listeners.push({ type, handler })
  }
  object.removeEventListener = (type, handler) => {
    listeners = listeners.filter(l => l.type === type && l.handler === handler)
  }
  object.emit = (type, ...args) => {
    listeners.filter(l => l.type === type).forEach(l => l.handler(...args))
  }
}

mockEventEmitter(AppState)
AppState.change = (state) => {
  AppState.currentState = state
  AppState.emit('change', state)
}

mockEventEmitter(Linking)
