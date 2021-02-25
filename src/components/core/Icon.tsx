import React from 'react'
import { TouchableOpacity } from 'react-native'
import { IconProps as $IconProps } from 'react-native-vector-icons/Icon'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useRestyle, useTheme } from '@shopify/restyle'
import { BaseTextProps, baseTextRestyleFunctions } from 'lib/restyle'
import { Theme, ThemeSize } from 'theme'

enum IconType {
  MATERIAL = 'material'
}

const ICON_COMPONENTS = {
  [IconType.MATERIAL]: MaterialIcon
}

const HIT_SLOP = { top: 10, left: 10, bottom: 10, right: 10 }

export interface IconProps extends BaseTextProps<Theme>, Omit<$IconProps, 'size' | 'color'> {
  type?: IconType,
  size?: ThemeSize | number
}

export const Icon = ({
  type = IconType.MATERIAL,
  name,
  size: _size = 24,
  onPress,
  ...props
} : IconProps) => {
  if (!props.color) {
    props.color = 'mainForegroundRegular'
  }

  const theme = useTheme<Theme>()
  const iconProps = useRestyle(baseTextRestyleFunctions, props)
  let size = typeof _size === 'string' ? theme.fontSizes[_size] : _size

  const IconComponent = ICON_COMPONENTS[type]
  const icon = (
    <IconComponent
      name={name}
      size={size}
      {...iconProps} />
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
