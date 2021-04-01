import React from 'react'
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock'

// Step 2 of fix for "You called act(async () => ...) without await" error:
// https://github.com/callstack/react-native-testing-library/issues/379#issuecomment-714341282
global.Promise = global.originalPromise

//-- Libraries --//

jest.mock('jest-mock', () => jest)

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)

jest.mock('react-native-device-info', () => mockRNDeviceInfo);

jest.mock('react-native-localize', () => ({
  findBestAvailableLanguage: jest.fn(),
  getLocales: jest.fn()
}))

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper')

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  Reanimated.default.call = () => {}
  return Reanimated
})

jest.mock('react-native-safe-area-context', () => {
  const { SafeAreaProvider, ...rest } = jest.requireActual('react-native-safe-area-context')
  const MockSafeAreaProvider = ({ children }) => (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 0, height: 0 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      {children}
    </SafeAreaProvider>
  )

  return {
    SafeAreaProvider: MockSafeAreaProvider,
    ...rest
  }
})

jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn()
}))

// Fixes react-hook-form not updating form state:
// https://github.com/react-hook-form/react-hook-form/issues/2479
global.window = global

//-- Source --//

jest.mock('utils/device', () => ({
  getDeviceKey: jest.fn(() => Promise.resolve('test-device-key'))
}))
