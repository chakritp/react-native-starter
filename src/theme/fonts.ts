import { TextStyle } from 'react-native'
import fontFamilies from './fontFamilies'

export default {
  bodyLight: {
    fontFamily: fontFamilies.body,
    fontWeight: '300'
  },
  bodyRegular: {
    fontFamily: fontFamilies.body,
    fontWeight: '400'
  },
  bodyMedium: {
    fontFamily: fontFamilies.body,
    fontWeight: '500'
  },
  bodyBold: {
    fontFamily: fontFamilies.body,
    fontWeight: '700'
  },
  headingLight: {
    fontFamily: fontFamilies.heading,
    fontWeight: '300'
  },
  headingRegular: {
    fontFamily: fontFamilies.heading,
    fontWeight: '400'
  },
  headingMedium: {
    fontFamily: fontFamilies.heading,
    fontWeight: '500'
  },
  headingBold: {
    fontFamily: fontFamilies.heading,
    fontWeight: '700'
  }
} as { [key: string]: TextStyle }
