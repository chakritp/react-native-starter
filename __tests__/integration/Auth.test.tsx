import React from 'react'
import { AppState, Linking } from 'react-native'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import { factory } from 'factories'
import { apiMocker } from 'mocks'
import { api } from 'services'
import { getCurrentRouteName, localStorageMock } from '../testHelpers'
import { App } from 'App'

describe('Auth', () => {
  beforeEach(() => {
    apiMocker.success(api.devices, 'create')
  })

  afterEach(() => {
    jest.restoreAllMocks()
    localStorageMock.reset()
  })

  it('completes sign in flow', async () => {
    const requestCodeSpy = apiMocker.success(api.auth, 'requestCode', {
      data: { token: 'test-token' }
    })
    const signInSpy = apiMocker.success(api.auth, 'signIn', {
      data: {
        accessToken: 'test-token',
        user: factory.build('api.user')
      }
    })

    const q = render(<App />)
    const startBtn = await q.findByLabelText('Get Started')
    fireEvent.press(startBtn)
    
    expect(getCurrentRouteName()).toBe('SignIn')
    const submitBtn = q.getByLabelText('Next')
    expect(submitBtn).toBeDisabled()
    fireEvent.changeText(q.getByLabelText(/Email/), 'tester@iterate.co')
    expect(submitBtn).toBeEnabled()
    fireEvent.press(submitBtn)
    await waitFor(() => expect(requestCodeSpy).toHaveBeenCalledWith({ email: 'tester@iterate.co' }))
    
    expect(getCurrentRouteName()).toBe('Verify')
    expect(q.queryByText('tester@iterate.co')).toBeTruthy()
    fireEvent.press(q.getByLabelText('Resend email'))
    await waitFor(() => expect(requestCodeSpy).toHaveBeenCalledWith({ email: 'tester@iterate.co' }))
    AppState.currentState = 'inactive'
    Linking.emit('url', { url: 'https://typescriptstarter.com/auth/verify?email=tester@iterate.co&code=123456' })
    // @ts-ignore
    AppState.change('active')
    await waitFor(() => (
      expect(signInSpy).toHaveBeenCalledWith({ email: 'tester@iterate.co', token: 'test-token', code: '123456' })
    ))

    expect(getCurrentRouteName()).toBe('Home')
  })

  it('signs in when app is launched with initial verify url', async () => {
    localStorageMock.set('/authStore/verificationToken', 'test-token')
    const signInSpy = apiMocker.success(api.auth, 'signIn', {
      data: {
        accessToken: 'test-token',
        user: factory.build('api.user')
      }
    })
    const getInitialURLSpy = jest.spyOn(Linking, 'getInitialURL')
      .mockResolvedValue('https://typescriptstarter.com/auth/verify?email=tester@iterate.co&code=123456')

    render(<App />)
    await waitFor(() => expect(getInitialURLSpy).toHaveBeenCalled())
    // @ts-ignore
    AppState.change('active')
    expect(signInSpy).toHaveBeenCalledWith({ email: 'tester@iterate.co', token: 'test-token', code: '123456' })
    expect(getCurrentRouteName()).toBe('Home')
  })
})
