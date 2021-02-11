import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useTheme } from 'theme'
import { renderIcon } from 'helpers/ui'
import ImageLoader from './ImageLoader'

export default function Avatar({
  style,
  imageContainerStyle,
  imageStyle,
  size,
  rounded,
  icon,
  source,
  children
}) {
  const theme = useTheme()
  const width = theme.sizes[size]

  let placeholderContent

  if (icon) {
    placeholderContent = renderIcon(icon, { size: width * 0.75, color: 'textInverse' })
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

Avatar.defaultProps = {
  size: 'm'
}
