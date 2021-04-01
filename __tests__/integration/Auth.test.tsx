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
    fireEvent.changeText(q.getByLabelText(/Email/), 'test@test.com')
    expect(submitBtn).toBeEnabled()
    fireEvent.press(submitBtn)
    await waitFor(() => expect(requestCodeSpy).toHaveBeenCalledWith({ email: 'test@test.com' }))
    
    expect(getCurrentRouteName()).toBe('Verify')
    expect(q.queryByText('test@test.com')).toBeTruthy()
    fireEvent.press(q.getByLabelText('Resend email'))
    await waitFor(() => expect(requestCodeSpy).toHaveBeenCalledWith({ email: 'test@test.com' }))
    AppState.currentState = 'inactive'
    Linking.emit('url', { url: 'https://typescriptstarter.com/auth/verify?email=test@test.com&code=123456' })
    AppState.change('active')
    await waitFor(() => (
      expect(signInSpy).toHaveBeenCalledWith({ email: 'test@test.com', token: 'test-token', code: '123456' })
    ))

    expect(getCurrentRouteName()).toBe('Home')
  })

  it('shows validation errors on SignIn screen', async () => {
    apiMocker.error(api.auth, 'requestCode', {
      status: 400,
      code: 'invalid_request',
      parameters: {
        email: ['Server validation error']
      }
    })
    const q = render(
      <App initialNavState={{
        routes: [{ name: 'Auth', state: { routes: [{ name: 'SignIn' }] } }]
      }} />
    )
    const emailInput = await q.findByLabelText(/Email/)
    const submitBtn = q.getByLabelText('Next')

    fireEvent.changeText(emailInput, 'invalid')
    fireEvent.press(submitBtn)
    await waitFor(() => expect(q.queryByText('Email address must be a valid email address')).toBeTruthy())

    fireEvent.changeText(emailInput, 'test@test.com')
    fireEvent.press(submitBtn)
    await waitFor(() => expect(q.queryByText('Server validation error')).toBeTruthy())
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
      .mockResolvedValue('https://typescriptstarter.com/auth/verify?email=test@test.com&code=123456')

    render(<App />)
    await waitFor(() => expect(getInitialURLSpy).toHaveBeenCalled())
    AppState.change('active')
    expect(signInSpy).toHaveBeenCalledWith({ email: 'test@test.com', token: 'test-token', code: '123456' })
    expect(getCurrentRouteName()).toBe('Home')
  })
})
