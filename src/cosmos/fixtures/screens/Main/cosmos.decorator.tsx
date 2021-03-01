import React, { PropsWithChildren } from 'react'
import { SignedInDecorator } from 'cosmos/helpers'

export default ({ children }: PropsWithChildren<any>) => {
  return (
    <SignedInDecorator>
      {children}
    </SignedInDecorator>
  )
}
