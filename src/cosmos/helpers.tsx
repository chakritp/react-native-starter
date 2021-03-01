import React, { PropsWithChildren, useEffect, useMemo, useRef } from 'react'
import { PartialState } from '@react-navigation/native'
import { PartialNavigationState } from 'components/core'
import { mockApi, mockLocalStorage } from 'mocks'
import { Root as $Root } from 'screens/Root'

let mocks: {
  localStorage: ReturnType<typeof mockLocalStorage>
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
          mock.unmock()
        }
        mocks = undefined
      }
    }
  }, [])

  return mocks
}

export function useMockApi(callback: (params: {
  success: typeof mockApi.success,
  error: typeof mockApi.error,
  resolve: typeof mockApi.resolve
}) => void) {
  const spies: any[] = useMemo(() => ([]), [])
  
  const resetMocks = () => {
    for (const spy of spies) {
      spy.mockReset()
      spies.length = 0
    }
  }
  
  resetMocks()

  callback({
    success(...args) {
      const spy = mockApi.success(...args)
      spies.push(spy)
      return spy
    },
    error(...args) {
      const spy = mockApi.error(...args)
      spies.push(spy)
      return spy
    },
    resolve(...args) {
      const spy = mockApi.resolve(...args)
      spies.push(spy)
      return spy
    }
  })

  useEffect(() => resetMocks)
}

interface RootProps {
  snapshot?: object
  navState?: PartialNavigationState
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
    <$Root snapshot={snapshot} initialNavigationState={navState} />
  )
}

export function createSignedInDecorator() {
  return (props: any) => {
    return <SignedInDecorator {...props} />
  }
}

export const SignedInDecorator = (props: PropsWithChildren<any>) => {
  useMocks(({ localStorage }) => {
    localStorage.set('/authStore/deviceRegistered', true)
    localStorage.set('/authStore/accessToken', 'test-token')
  })
  return props.children
}
