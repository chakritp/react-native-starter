import fonts from './fonts'
import palette from './palette'

export default {
  colors: {
    borderHeavy: palette.gray400,
    borderMedium: palette.gray300,
    borderLight: palette.gray200,
    containerBg: palette.white,
    containerMutedBg: palette.gray50,
    inputBg: palette.white,
    inputBorder: palette.gray300,
    inputText: palette.gray600,
    label: palette.gray500,
    link: palette.blue500,
    listItemBg: palette.white,
    listItemHighlightBg: palette.gray200,
    listItemIcon: palette.gray200,
    modalInputContent: palette.white,
    placeholder: palette.gray300,
    navBg: palette.blue500,
    navBorder: 'rgba(0, 0, 0, 0)',
    navTint: palette.white,
    navTintMuted: palette.gray200,
    navPrimary: palette.white,
    searchInputBg: palette.gray100,
    text: palette.gray600,
    textInverse: palette.white,
    textMuted: palette.gray400,
    textLight: palette.gray300,
    white: palette.white,
  
    // Statuses
    attention: palette.yellow400,
    attentionMuted: palette.yellow300,
    attentionHeavy: palette.yellow500,
    info: palette.blue500,
    infoMuted: palette.blue200,
    infoHeavy: palette.blue500,
    success: palette.green400,
    successMuted: palette.green200,
    successHeavy: palette.green500,
    warning: palette.orange400,
    warningMuted: palette.orange300,
    warningHeavy: palette.orange500,
    danger: palette.red500,
    dangerMuted: palette.red300,
    dangerHeavy: palette.red500
  },
  fonts,
  fontSizes: {
    xxl: 48,
    xl: 32,
    l: 26,
    m: 20,
    s: 18,
    xs: 16,
    xxs: 14,
  },
  spacing: {
    xxl: 36,
    xl: 24,
    l: 16,
    m: 10,
    s: 6,
    xs: 4,
    xxs: 2
  },
  sizes: {
    xxl: 100,
    xl: 80,
    l: 56,
    m: 44,
    s: 32,
    xs: 24,
    xxs: 16
  },
  radii: {
    l: 10,
    m: 6,
    s: 4,
    xs: 3
  },
  buttonVariants: {
    primary: {
      bgColor: palette.blue500,
      textColor: palette.white,
      outlineColor: 'transparent',
    },
    secondary: {
      bgColor: 'transparent',
      textColor: palette.blue500,
      outlineColor: palette.blue500,
    },
    listFooter: {
      bgColor: palette.white,
      textColor: palette.blue500,
      outlineColor: palette.white,
      radius: 0
    }
  }
}
