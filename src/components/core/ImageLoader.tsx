import React, { ComponentType, PureComponent, ReactNode } from 'react'
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
import { ThemeContextProps, createThemedStyleSheet, withTheme } from 'theme'

export interface ImageLoaderProps extends Omit<ImageProps, 'style' | 'source'> {
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
  placeholderStyle?: StyleProp<ViewStyle>
  placeholderContent?: ReactNode
  ImageComponent?: ComponentType<ImageProps>
  source?: ImageProps['source']
  children?: ReactNode
}

interface ImageLoaderState {
  placeholderOpacity: Animated.Value
}

class ImageLoaderBase extends PureComponent<ImageLoaderProps & ThemeContextProps, ImageLoaderState> {
  state = {
    placeholderOpacity: new Animated.Value(1),
  }

  onLoad = (ev: NativeSyntheticEvent<ImageLoadEventData>) => {
    const minimumWait = 100
    const staggerNonce = 200 * Math.random()

    setTimeout(
      () => {
        Animated.timing(this.state.placeholderOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start()
      },
      Platform.OS === 'android' ? 0 : Math.floor(minimumWait + staggerNonce)
    )

    if (this.props.onLoad) {
      this.props.onLoad(ev)
    }
  }

  render() {
    const {
      getStyles,
      placeholderStyle,
      placeholderContent,
      style,
      imageStyle,
      ImageComponent = Image,
      source,
      children,
      ...imageProps
    } = this.props
    const styles = getStyles(themedStyles)
    const hasImage = !!source

    return (
      <View
        accessibilityIgnoresInvertColors={true}
        style={[styles.container, style]}>

        {source && (
          <ImageComponent
            {...imageProps}
            source={source}
            onLoad={this.onLoad}
            style={[StyleSheet.absoluteFill, imageStyle]} />
        )}
        
        <Animated.View
          pointerEvents={hasImage ? 'none' : 'auto'}
          accessibilityElementsHidden={hasImage}
          importantForAccessibility={hasImage ? 'no-hide-descendants' : 'yes'}
          style={[
            StyleSheet.absoluteFill,
            { opacity: hasImage ? this.state.placeholderOpacity : 1 }
          ]}>
          <View
            style={[
              style,
              styles.placeholder,
              placeholderStyle,
            ]}>
            {placeholderContent}
          </View>
        </Animated.View>

        <View style={style}>{children}</View>
      </View>
    )
  }
}

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
    overflow: 'hidden'
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.placeholder
  },
}))

export const ImageLoader = withTheme(ImageLoaderBase)
