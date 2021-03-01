import  { TextInputProps } from 'react-native'
import { createTheme } from '@shopify/restyle'
import fonts from './fonts'
import palette from './palette'

const fontSizes = {
  xxxs: 10,
  xxs: 12,
  xs: 14,
  s: 16,
  m: 18,
  xm: 20,
  l: 24,
  xl: 28,
  xxl: 36,
  xxxl: 48
}

export default createTheme({
  dark: false,
  keyboardAppearance: 'light' as TextInputProps['keyboardAppearance'],
  colors: {
    // General
    white: palette.white,
    transparent: 'transparent',
    brandPrimaryRegular: palette.blue500,
    brandPrimaryInverse: palette.white,
    mainBackgroundHeavy: palette.white,
    mainBackgroundRegular: palette.white,
    mainBackgroundMedium: palette.gray200,
    mainBackgroundMuted: palette.gray100,
    mainBackgroundSoft: palette.gray50,
    mainBorderHeavy: palette.gray400,
    mainBorderRegular: palette.gray300,
    mainBorderMuted: palette.gray200,
    mainForegroundHeavy: palette.black,
    mainForegroundRegular: palette.gray600,
    mainForegroundMedium: palette.gray500,
    mainForegroundMuted: palette.gray400,
    mainForegroundSoft: palette.gray300,

    // Highlights
    attentionRegular: palette.yellow400,
    attentionMuted: palette.yellow300,
    attentionHeavy: palette.yellow500,
    infoRegular: palette.blue500,
    infoMuted: palette.blue200,
    infoHeavy: palette.blue500,
    successRegular: palette.green400,
    successMuted: palette.green200,
    successHeavy: palette.green500,
    warningRegular: palette.orange400,
    warningMuted: palette.orange300,
    warningHeavy: palette.orange500,
    dangerRegular: palette.red500,
    dangerMuted: palette.red300,
    dangerHeavy: palette.red500,

    // Inputs
    inputBackgroundRegular: palette.gray50,
    inputBackgroundMuted: palette.gray200,
    inputBorderRegular: palette.gray200,
    inputForegroundRegular: palette.gray600,
    inputForegroundMuted: palette.gray400,
    inputForegroundSoft: palette.gray300,
    modalInputBackground: palette.white,

    // Nav
    navBackgroundRegular: palette.white,
    navBorderRegular: palette.gray200,
    navPrimary: palette.blue500,
    navNotification: palette.red500,
    navText: palette.gray500,

    // Other
    link: palette.blue500
  },
  breakpoints: {
    phone: 0,
    longPhone: {
      width: 0,
      height: 812
    },
    tablet: 768,
    largeTablet: 1024,
  },
  spacing: {
    auto: 'auto' as any,
    none: 0,
    xxxs: 1,
    xxs: 2,
    xs: 4,
    s: 6,
    m: 10,
    xm: 12,
    xxm: 16,
    l: 20,
    xl: 24,
    xxl: 36,
    xxxl: 64
  },
  sizes: {
    xxxs: 10,
    xxs: 16,
    xs: 24,
    s: 32,
    m: 44,
    xm: 48,
    l: 56,
    xl: 80,
    xxl: 100
  },
  fonts,
  fontSizes,
  borderRadii: {
    none: 0,
    xs: 3,
    s: 4,
    m: 6,
    l: 10,
    xl: 16
  },
  textVariants: {
    h1: {
      ...fonts.headingMedium,
      fontSize: fontSizes.xl,
      lineHeight: fontSizes.xl * 1.2,
      color: 'mainForegroundRegular'
    },
    h2: {
      ...fonts.headingMedium,
      fontSize: fontSizes.l,
      lineHeight: fontSizes.l * 1.2,
      color: 'mainForegroundRegular'
    },
    h3: {
      ...fonts.headingMedium,
      fontSize: fontSizes.m,
      lineHeight: fontSizes.m * 1.2,
      color: 'mainForegroundRegular'
    },
    h4: {
      ...fonts.headingMedium,
      fontSize: fontSizes.s,
      lineHeight: fontSizes.s * 1.2,
      color: 'mainForegroundRegular'
    },
    h5: {
      ...fonts.headingMedium,
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * 1.2,
      color: 'mainForegroundRegular'
    },
    h6: {
      ...fonts.headingMedium,
      fontSize: fontSizes.xxs,
      lineHeight: fontSizes.xxs * 1.2,
      color: 'mainForegroundRegular'
    },
    s1: {
      ...fonts.headingRegular,
      fontSize: fontSizes.l,
      lineHeight: fontSizes.l * 1.2,
      color: 'mainForegroundRegular'
    },
    s2: {
      ...fonts.headingRegular,
      fontSize: fontSizes.m,
      lineHeight: fontSizes.m * 1.2,
      color: 'mainForegroundRegular'
    },
    s3: {
      ...fonts.headingRegular,
      fontSize: fontSizes.s,
      lineHeight: fontSizes.s * 1.2,
      color: 'mainForegroundRegular'
    },
    p1: {
      ...fonts.bodyRegular,
      fontSize: fontSizes.l,
      lineHeight: fontSizes.l * 1.2,
      color: 'mainForegroundRegular'
    },
    p2: {
      ...fonts.bodyRegular,
      fontSize: fontSizes.m,
      lineHeight: fontSizes.m * 1.2,
      color: 'mainForegroundRegular'
    },
    p3: {
      ...fonts.bodyRegular,
      fontSize: fontSizes.s,
      lineHeight: fontSizes.s * 1.2,
      color: 'mainForegroundRegular'
    },
    p4: {
      ...fonts.bodyRegular,
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * 1.2,
      color: 'mainForegroundRegular'
    },
    c1: {
      ...fonts.bodyLight,
      fontSize: fontSizes.xs,
      lineHeight: fontSizes.xs * 1.2,
      color: 'mainForegroundRegular'
    },
    c2: {
      ...fonts.bodyLight,
      fontSize: fontSizes.xxs,
      lineHeight: fontSizes.xxs * 1.2,
      color: 'mainForegroundRegular'
    }
  },
  buttonVariants: {
    defaults: {
      borderRadius: 'm'
    },
    primary: {
      backgroundColor: 'brandPrimaryRegular',
      borderColor: 'transparent',
      foregroundColor: 'brandPrimaryInverse'
    },
    primaryTransparent: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      foregroundColor: 'brandPrimaryRegular',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: 'brandPrimaryRegular',
      foregroundColor: 'brandPrimaryRegular'
    },
    listFooter: {
      backgroundColor: 'mainBackgroundRegular',
      borderColor: 'mainBackgroundRegular',
      foregroundColor: 'brandPrimaryRegular',
      borderRadius: 'none'
    },
    input: {
      backgroundColor: 'inputBackgroundRegular',
      borderColor: 'inputBorderRegular',
      foregroundColor: 'inputForegroundRegular'
    }
  },
  toastVariants: {
    defaults: {
      textColor: 'white'
    },
    info: {
      backgroundColor: 'infoRegular'
    },
    success: {
      backgroundColor: 'successRegular'
    },
    warning: {
      backgroundColor: 'warningRegular'
    },
    danger: {
      backgroundColor: 'dangerRegular'
    }
  }
})
