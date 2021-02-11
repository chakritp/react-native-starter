import { Platform, Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'

export enum WindowSize {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l'
}

const SIZE_VALUES = {
  [WindowSize.XS]: 1,
  [WindowSize.S]: 2,
  [WindowSize.M]: 3,
  [WindowSize.L]: 4
}

const { width, height } = Dimensions.get('window')

const size = height <= 580
  ? height <= 480 ? WindowSize.XS : WindowSize.S
  : height <= 720 ? WindowSize.M : WindowSize.L

const window = {
  width,
  height,
  statusBarOffset: Platform.OS === 'android' || DeviceInfo.hasNotch() ? 0 : 20,
  size,
  sizeUp(fromSize: WindowSize) {
    return SIZE_VALUES[size] >= SIZE_VALUES[fromSize]
  },
  sizeDown(fromSize: WindowSize) {
    return SIZE_VALUES[size] <= SIZE_VALUES[fromSize]
  }
}

export default window
