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

const window = {
  statusBarOffset: Platform.OS === 'android' || DeviceInfo.hasNotch() ? 0 : 20,
  get width() {
    return Dimensions.get('window').width
  },
  get height() {
    return Dimensions.get('window').height
  },
  get size() {
    const { height } = window
    return height <= 580
      ? height <= 480 ? WindowSize.XS : WindowSize.S
      : height <= 720 ? WindowSize.M : WindowSize.L
  },
  sizeUp(fromSize: WindowSize) {
    return SIZE_VALUES[window.size] >= SIZE_VALUES[fromSize]
  },
  sizeDown(fromSize: WindowSize) {
    return SIZE_VALUES[window.size] <= SIZE_VALUES[fromSize]
  }
}

export default window
