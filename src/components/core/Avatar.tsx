import React, { ReactNode } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, ImageStyle, ImageProps } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { IconProp, renderIcon } from 'helpers/ui'
import { Theme, ThemeSize } from 'theme'
import { ImageLoader } from './ImageLoader'

export interface AvatarProps {
  style?: StyleProp<ViewStyle>
  imageContainerStyle?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  size?: ThemeSize | number,
  rounded?: boolean,
  icon?: IconProp,
  source?: ImageProps['source'],
  children?: ReactNode
}

export function Avatar({
  style,
  imageContainerStyle,
  imageStyle,
  size = 'm',
  rounded,
  icon,
  source,
  children
} : AvatarProps) {
  const theme = useTheme<Theme>()
  const width = typeof size === 'string' ? theme.sizes[size] : size

  let placeholderContent

  if (icon) {
    placeholderContent = renderIcon(icon, { size: width * 0.75, color: 'white' })
  }

  return (
    <View style={style}>
      <ImageLoader
        style={[
          { width, height: width },
          rounded && { borderRadius: 1000 },
          imageContainerStyle
        ]}
        imageStyle={imageStyle}
        placeholderContent={placeholderContent}
        resizeMode="cover"
        source={source} />
      {children && (
        <View style={StyleSheet.absoluteFill}>
          {children}
        </View>
      )}
    </View>
  )
}
