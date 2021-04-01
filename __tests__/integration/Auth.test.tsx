import React from 'react'
import { AppState, Linking } from 'react-native'
import { render, waitFor, fireEvent } from '@testing-library/react-native'
import { factory } from 'factories'
import { apiMocker } from 'mocks'
import { api } from 'services'
import { RootStore } from 'stores'
import { App } from 'App'
import { getCurrentRouteName, localStorageMock } from '../testHelpers'

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
      data: { token: 'verification-token' }
    })
    const signInSpy = apiMocker.success(api.auth, 'signIn', {
      data: {
        accessToken: 'access-token',
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
      expect(signInSpy).toHaveBeenCalledWith({ email: 'test@test.com', token: 'verification-token', code: '123456' })
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

  it('signs in by entering verification code', async () => {
    const signInSpy = apiMocker.success(api.auth, 'signIn', {
      data: {
        accessToken: 'access-token',
        user: factory.build('api.user')
      }
    })
    const rootStore = RootStore.create({
      authStore: { email: 'test@test.com', verificationToken: 'verification-token' }
    })
    const q = render(
      <App rootStore={rootStore} initialNavState={{
        routes: [{ name: 'Auth', state: { routes: [{ name: 'Verify' }] } }]
      }} />
    )
    const codeInput = await q.findByLabelText(/code/)
    fireEvent.changeText(codeInput, '123456')
    await waitFor(() => (
      expect(signInSpy).toHaveBeenCalledWith({ email: 'test@test.com', token: 'verification-token', code: '123456' })
    ))
  })

  it('signs in when app is launched with initial verify url', async () => {
    AppState.currentState = 'inactive'
    localStorageMock.set('/authStore/verificationToken', 'verification-token')
    const signInSpy = apiMocker.success(api.auth, 'signIn', {
      data: {
        accessToken: 'access-token',
        user: factory.build('api.user')
      }
    })
    const getInitialURLSpy = jest.spyOn(Linking, 'getInitialURL')
      .mockResolvedValue('https://typescriptstarter.com/auth/verify?email=test@test.com&code=123456')

    render(<App />)
    await waitFor(() => expect(getInitialURLSpy).toHaveBeenCalled())
    AppState.change('active')
    await waitFor(() => (
      expect(signInSpy).toHaveBeenCalledWith({ email: 'test@test.com', token: 'verification-token', code: '123456' })
    ))
    expect(getCurrentRouteName()).toBe('Home')
  })
})
