import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react'
import { MockLocalStorageWrapper, apiMocker, mockLocalStorage } from 'mocks'
import { Root as $Root, RootProps as $RootProps } from 'screens/Root'
import { factory } from 'factories'

export * from './useMockCollection'

let mocks: {
  localStorage: MockLocalStorageWrapper
} | undefined
let useMocksCount = 0

export function useMocks(callback?: (mocks: any) => void) {
  const callbackRef = useRef(false)

  if (!mocks) {
    mocks = {
      localStorage: mockLocalStorage()
    }
  }

  if (!callbackRef.current && callback) {
    callback(mocks)
    callbackRef.current = true
  }

  useEffect(() => {
    useMocksCount++

    return () => {
      if (--useMocksCount === 0) {
        for (const mock of Object.values(mocks!)) {
          mock.restore()
        }
        mocks = undefined
      }
    }
  }, [])

  return mocks
}

export function useApiMocker(callback: (params: {
  success: typeof apiMocker.success,
  error: typeof apiMocker.error,
  resolve: typeof apiMocker.resolve
}) => void) {
  const spies: any[] = useMemo(() => ([]), [])
  
  const reset = () => {
    for (const spy of spies) {
      spy.mockRestore()
    }
    spies.length = 0
  }

  reset()

  callback({
    success(...args) {
      const spy = apiMocker.success(...args)
      spies.push(spy)
      return spy
    },
    error(...args) {
      const spy = apiMocker.error(...args)
      spies.push(spy)
      return spy
    },
    resolve(...args) {
      const spy = apiMocker.resolve(...args)
      spies.push(spy)
      return spy
    }
  })

  useEffect(() => reset, [])
}

interface RootProps {
  snapshot?: $RootProps['snapshot']
  navState?: $RootProps['initialNavState']
}

export function createRoot(propsCallback?: () => RootProps) {
  let props: RootProps

  return () => {
    if (!props) {
      props = propsCallback ? propsCallback() : {}
    }
    return <Root snapshot={props.snapshot} navState={props.navState} />
  }
}

export const Root = ({ snapshot, navState } : RootProps) => {
  return (
    <$Root snapshot={snapshot} initialNavState={navState} />
  )
}

export function createSignedInDecorator() {
  return (props: any) => {
    return <SignedInDecorator {...props} />
  }
}

export const SignedInDecorator = (props: PropsWithChildren<any>) => {
  useMocks(({ localStorage }) => {
    localStorage
      .set('/authStore/deviceRegistered', true)
      .set('/authStore/accessToken', 'test-token')
      .set('/authStore/user', factory.build('api.user'))
  })
  return props.children
}
