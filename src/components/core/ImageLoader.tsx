import noop from 'lodash/noop'
import React, { PureComponent } from 'react'
import {
  Animated,
  Image,
  StyleSheet,
  View,
  Platform,
} from 'react-native'
import { createThemedStyleSheet, withTheme } from 'theme'

class ImageLoaderBase extends PureComponent {
  static defaultProps = {
    ImageComponent: Image,
    onLoad: noop
  }

  state = {
    placeholderOpacity: new Animated.Value(1),
  }

  onLoad = () => {
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

    this.props.onLoad()
  }

  render() {
    const {
      getStyles,
      placeholderStyle,
      placeholderContent,
      style,
      imageStyle,
      ImageComponent,
      children,
      ...imageProps
    } = this.props
    const styles = getStyles(themedStyles)
    const hasImage = !!imageProps.source

    return (
      <View
        accessibilityIgnoresInvertColors={true}
        style={[styles.container, style]}>
        <ImageComponent
          {...imageProps}
          onLoad={this.onLoad}
          style={[StyleSheet.absoluteFill, imageStyle]} />

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
