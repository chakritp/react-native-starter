import React from 'react'
import { render, waitFor } from '@testing-library/react-native'
import { factory } from 'factories'
import { apiMocker } from 'mocks'
import { api } from 'services'
import { App } from 'App'
import { getCurrentRouteName, localStorageMock } from '../testHelpers'

describe('App', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    localStorageMock.reset()
  })

  describe('when signed out', () => {
    it('renders Landing screen', async () => {
      await waitFor(() => render(<App />))
      expect(getCurrentRouteName()).toBe('Landing')
    })
  })

  describe('when signed in', () => {
    beforeEach(() => {
      localStorageMock
        .set('/authStore/deviceRegistered', true)
        .set('/authStore/accessToken', 'test-token')
        .set('/authStore/user', factory.build('api.user'))
    })

    it('renders Home screen', async () => {
      const getProfileSpy = apiMocker.success(api.users, 'getProfile', {
        data: factory.build('api.user')
      })
      await waitFor(() => render(<App />))
      expect(getProfileSpy).toHaveBeenCalled()
      expect(getCurrentRouteName()).toBe('Home')
    })

    it('renders AppUpgradeRequired screen when api requires upgrade', async () => {
      apiMocker.error(api.users, 'getProfile', {
        code: 'app_upgrade_required'
      })
      await waitFor(() => render(<App />))
      expect(getCurrentRouteName()).toBe('AppUpgradeRequired')
    })
  })
})
