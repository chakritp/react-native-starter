import { TextStyle } from 'react-native'
import fontFamilies from './fontFamilies'

type Fonts<T> = {
  [P in keyof T]: { fontFamily: string, fontWeight: TextStyle['fontWeight'] }
}

const fonts = {
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
}

export default fonts as Fonts<typeof fonts>
