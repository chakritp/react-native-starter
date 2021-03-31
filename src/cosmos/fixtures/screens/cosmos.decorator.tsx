import React, { ReactNode, useEffect, useRef } from 'react'
import { useApiMocker } from 'cosmos/helpers'
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

  useApiMocker(({ success }) => {
    success(api.auth, 'requestCode', {
      data: { token: 'xxx' }
    })

    success(api.auth, 'signIn', () => ({
      data: {
        accessToken: 'test-token',
        user: factory.build('api.user')
      }
    }))

    success(api.auth, 'signOut')

    success(api.devices, 'create')

    success(api.devices, 'update')

    success(api.users, 'getProfile', () => ({
      data: factory.build('api.user')
    }))
  })

  return (
    <StoreProvider value={rootStoreRef.current}>
      {props.children}
    </StoreProvider>
  )
}
