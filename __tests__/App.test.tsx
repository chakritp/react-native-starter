/**
 * @format
 */

import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { App } from 'App'

it('renders without crashing', () => {
  render(<App />)
})
