import DeviceInfo from 'react-native-device-info'
import RNSimpleCrypto from 'react-native-simple-crypto'

let deviceKeyPromise
export async function getDeviceKey() {
  if (!deviceKeyPromise) {
    deviceKeyPromise = new Promise(async (resolve, reject) => {
      try {
        const keyHashHex = await RNSimpleCrypto.SHA.sha256(DeviceInfo.getUniqueId())
        const keyHashBytes = RNSimpleCrypto.utils.convertHexToArrayBuffer(keyHashHex)
        resolve(RNSimpleCrypto.utils.convertArrayBufferToBase64(keyHashBytes).slice(0, 32))
      } catch (error) {
        reject(error)
      }
    })
  }
  return deviceKeyPromise
}
