import { createTheme } from '@shopify/restyle'
import fonts from './fonts'
import palette from './palette'

const fontSizes = {
  xxs: 14,
  xs: 16,
  s: 18,
  m: 20,
  l: 26,
  xl: 32,
  xxl: 48
}

export default createTheme({
  dark: false,
  keyboardAppearance: 'light',
  colors: {
    // General
    white: palette.white,
    transparent: 'transparent',
    mainBackgroundHeavy: palette.white,
    mainBackgroundRegular: palette.white,
    mainBackgroundMedium: palette.gray200,
    mainBackgroundMuted: palette.gray100,
    mainBackgroundSoft: palette.gray50,
    mainBorderHeavy: palette.gray400,
    mainBorderMedium: palette.gray300,
    mainBorderMuted: palette.gray200,
    mainForegroundHeavy: palette.black,
    mainForegroundRegular: palette.gray600,
    mainForegroundMedium: palette.gray500,
    mainForegroundMuted: palette.gray400,
    mainForegroundSoft: palette.gray300,
    
    // Specialized
    link: palette.blue500,

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
    dangerHeavy: palette.red500
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
    none: 0,
    xxs: 2,
    xs: 4,
    s: 6,
    m: 10,
    l: 16,
    xl: 24,
    xxl: 36,
    xxxl: 64
  },
  sizes: {
    xxs: 16,
    xs: 24,
    s: 32,
    m: 44,
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
    l: 10
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
