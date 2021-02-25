import React, { ReactNode, useCallback, useMemo } from 'react'
import {
  Animated,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  View,
  Platform,
  ImageProps,
  ImageStyle,
  NativeSyntheticEvent,
  ImageLoadEventData
} from 'react-native'
import { Box, BoxProps } from './Box'

export interface ImageLoaderProps extends BoxProps, Omit<ImageProps,
  'style' |
  'source' |
  'borderRadius' |
  'borderTopLeftRadius' |
  'borderTopRightRadius' |
  'borderBottomLeftRadius' |
  'borderBottomRightRadius' |
  'width' |
  'height'
> {
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  placeholderStyle?: StyleProp<ViewStyle>
  placeholderContent?: ReactNode
  ImageComponent?: typeof Image
  source?: ImageProps['source']
  children?: ReactNode
}

export const ImageLoader = ({
  placeholderStyle,
  placeholderContent,
  style,
  imageStyle,
  ImageComponent = Image,
  onError,
  onLoad,
  onLoadEnd,
  onLoadStart,
  progressiveRenderingEnabled,
  resizeMode,
  resizeMethod,
  source,
  loadingIndicatorSource,
  defaultSource,
  children
}: ImageLoaderProps) => {
  const placeholderOpacity = useMemo(() => new Animated.Value(1), [])
  const hasImage = !!source

  const onImageLoad = useCallback((ev: NativeSyntheticEvent<ImageLoadEventData>) => {
    const minimumWait = 100
    const staggerNonce = 200 * Math.random()

    setTimeout(
      () => {
        Animated.timing(placeholderOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start()
      },
      Platform.OS === 'android' ? 0 : Math.floor(minimumWait + staggerNonce)
    )

    if (onLoad) {
      onLoad(ev)
    }
  }, [placeholderOpacity, onLoad])

  return (
    <Box
      style={style}
      backgroundColor="transparent"
      position="relative"
      overflow="hidden"
      accessibilityIgnoresInvertColors
    >
      {source && (
        <ImageComponent
          onError={onError}
          onLoad={onImageLoad}
          onLoadEnd={onLoadEnd}
          onLoadStart={onLoadStart}
          progressiveRenderingEnabled={progressiveRenderingEnabled}
          resizeMode={resizeMode}
          resizeMethod={resizeMethod}
          source={source}
          loadingIndicatorSource={loadingIndicatorSource}
          defaultSource={defaultSource}
          style={[StyleSheet.absoluteFill, imageStyle]} />
      )}
      
      <Animated.View
        pointerEvents={hasImage ? 'none' : 'auto'}
        accessibilityElementsHidden={hasImage}
        importantForAccessibility={hasImage ? 'no-hide-descendants' : 'yes'}
        style={[
          StyleSheet.absoluteFill,
          { opacity: hasImage ? placeholderOpacity : 1 }
        ]}>
        <Box
          alignItems="center"
          justifyContent="center"
          width="100%"
          height="100%"
          backgroundColor="mainForegroundSoft"
          style={[
            style,
            placeholderStyle,
          ]}>
          {placeholderContent}
        </Box>
      </Animated.View>

      <View style={style}>{children}</View>
    </Box>
  )
}
