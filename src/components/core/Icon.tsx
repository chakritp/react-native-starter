import React from 'react'
import { StyleProp, TextStyle, TouchableOpacity } from 'react-native'
import { IconProps as $IconProps } from 'react-native-vector-icons/Icon'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ThemeColorKey, ThemeSizeKey, useTheme } from 'theme'

enum IconType {
  MATERIAL = 'material'
}

const ICON_COMPONENTS = {
  [IconType.MATERIAL]: MaterialIcon
}

const HIT_SLOP = { top: 10, left: 10, bottom: 10, right: 10 }

export interface IconProps extends Omit<$IconProps, 'size' | 'color'> {
  type?: IconType,
  color?: ThemeColorKey | string
  size?: ThemeSizeKey | number
}

export const Icon = ({
  type = IconType.MATERIAL,
  size: _size = 24,
  color = 'text',
  style,
  onPress,
  ...props
} : IconProps) => {
  const theme = useTheme()
  let size = typeof _size === 'string' ? theme.fontSizes[_size] : _size

  const baseStyle: StyleProp<TextStyle> = { lineHeight: size }
  if (color) {
    baseStyle.color = theme.colors[color as ThemeColorKey] || color as string
  }

  const IconComponent = ICON_COMPONENTS[type]
  const icon = (
    <IconComponent
      style={[baseStyle, style]}
      size={size}
      {...props} />
  )

  if (onPress) {
    return (
      <TouchableOpacity hitSlop={HIT_SLOP} activeOpacity={0.8} onPress={onPress}>
        {icon}
      </TouchableOpacity>
    )
  }

  return icon
}

Icon.Type = IconType
