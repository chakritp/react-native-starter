import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'

let apiUrl = Config.API_URL

// If we're on an Android emulator and API_URL points to localhost,
// change the host to 10.0.2.2.
if (Platform.OS === 'android' && DeviceInfo.isEmulatorSync()) {
  const portIndex = apiUrl.lastIndexOf(':')
  if (portIndex > 5 && apiUrl.slice(0, 5) === 'http:') {
    apiUrl = `http://10.0.2.2:${apiUrl.slice(portIndex + 1)}`
  }
}

export const API_URL = apiUrl
export const HTTP_SIGNATURE_KEY = Config.HTTP_SIGNATURE_KEY
export const SENTRY_DSN = ''
export const TERMS_OF_SERVICE_URL = 'https://typescriptstarter.com/terms-of-service'
export const PRIVACY_POLICY_URL = 'https://typescriptstarter.com/privacy-policy'
