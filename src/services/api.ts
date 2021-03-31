import DeviceInfo from 'react-native-device-info'
import { API_URL, HTTP_SIGNATURE_KEY } from 'config'
import { ApiClient } from 'lib/api'
import { getDeviceKey } from 'utils/device'

const client = new ApiClient({
  baseUrl: API_URL,
  defaultHeaders: {
    'TypescriptStarter-App-Id': DeviceInfo.getBundleId(),
    'TypescriptStarter-App-Version': DeviceInfo.getReadableVersion(),
    'TypescriptStarter-Device-System': `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`
  },
  async getSigningOptions() {
    const deviceKey = await getDeviceKey()
    return {
      key: HTTP_SIGNATURE_KEY,
      keyId: deviceKey
    }
  }
})

export default {
  client,
  auth: {
    requestCode: (data: object) => client.post('/auth/code', data),
    signIn: (data: object) => client.post('/auth/signin', data),
    signOut: () => client.post('/auth/signout')
  },
  devices: {
    create: (data: object) => client.post('/devices', data),
    update: (data: object) => client.patch('/devices', data),
  },
  users: {
    getProfile: () => client.get('/users/profile')
  }
}

if (__DEV__ && !global.test) {
  client
    .on('success', ({ url, method, status, data, body }) => {
      console.log(
        `${method} ${url}` +
        (data ? `\nRequest Body: ${JSON.stringify(data, null, 2)}` : '') +
        `\nResponse: ${JSON.stringify({ status, body }, null, 2)}\n`
      )
    })
    .on('error', ({ url, method, body, error }) => {
      const { status, code, parameters } = error as any
      console.log(
        `${error.message}: ${method} ${url}` +
        (body ? `\nRequest Body: ${JSON.stringify(body, null, 2)}` : '') +
        `\nResponse: ${JSON.stringify({ status, code, parameters }, null, 2)}\n`,
      )
    })
}
