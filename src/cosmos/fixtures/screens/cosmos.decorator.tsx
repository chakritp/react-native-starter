import React, { ReactNode, useEffect, useRef } from 'react'
import { useMockApi } from 'cosmos/helpers'
import { StoreProvider } from 'lib/mst'
import { factory } from 'factories'
import { api } from 'services'
import { RootStore, IRootStore } from 'stores'

export default (props: { children: ReactNode }) => {
  const rootStoreRef = useRef<IRootStore>()

  if (!rootStoreRef.current) {
    rootStoreRef.current = RootStore.create()
  }
  
  useEffect(() => {
    return () => {
      rootStoreRef.current = undefined
    }
  }, [])

  useMockApi(({ success }) => {
    success(api.auth, 'requestCode')

    success(api.auth, 'signIn', () => ({
      data: { accessToken: 'text-token' }
    }))

    success(api.auth, 'signOut')

    success(api.auth, 'signUp', () => ({
      data: factory.build('api.user')
    }))
  })

  return (
    <StoreProvider value={rootStoreRef.current}>
      {props.children}
    </StoreProvider>
  )
}
