import { chance, factory } from './factory'

factory.define('api.user', Object, {
  id: '1',
  email: 'tester@test.com',
  isVerified: true,
  createdAt: () => (chance.date({ year: 2020 }) as Date).toISOString(),
})
