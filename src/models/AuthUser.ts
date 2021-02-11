import { Instance, types } from 'mobx-state-tree'
import { customTypes } from 'lib/mst'

export const AuthUser = types
  .model({
    id: types.identifier,
    phoneNumber: types.string,
    phoneNumberVerified: types.boolean,
    isVerified: types.boolean,
    createdAt: customTypes.isoDate
  })

export interface IAuthUser extends Instance<typeof AuthUser> {}
