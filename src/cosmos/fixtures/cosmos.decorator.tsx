import { useEffect, PropsWithChildren } from 'react'
import { factory } from 'factories'
import { useMocks } from 'cosmos/helpers'

export default ({ children }: PropsWithChildren<any>) => {
  useMocks()

  useEffect(() => () => {
    factory.cleanUp()
  }, [])

  return children
}
