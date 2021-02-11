import { chance, factory } from './factory'

factory.define('api.user', Object, {
  id: factory.seqId('api.user.id'),
  phoneNumber: () => `+1${chance.phone({ formatted: false })}`,
  phoneNumberVerified: true,
  isVerified: true,
  createdAt: () => (chance.date({ year: 2020 }) as Date).toISOString(),
})
