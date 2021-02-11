import defaultTheme from './default'
import palette from './palette'

export default {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    borderHeavy: palette.white,
    containerBg: palette.blue500,
    containerMutedBg: palette.blue300,
    inputBg: palette.blue600,
    inputBorder: 'transparent',
    inputText: palette.white,
    label: palette.gray100,
    listItemBg: palette.blue600,
    listItemHighlightBg: palette.blue700,
    listItemIcon: palette.blue700,
    modalInputContent: palette.black,
    navBorder: palette.blue200,
    searchInputBg: palette.blue600,
    text: palette.white,
    textInverse: palette.gray600,
    textMuted: palette.gray200,
    textLight: palette.gray300,
  },
  keyboardAppearance: 'dark'
}
