import React, { Component } from 'react'
import {
  Animated,
  View,
  StyleSheet,
  NativeMethods
} from 'react-native'
import { t } from 'helpers/i18n'
import { Button } from './Button'
import { AutocompleteInputProps } from './form/AutocompleteInput'
import { SearchInput } from './form/SearchInput'

export interface SearchBarProps extends AutocompleteInputProps {
  cancelButtonTitle?: string
  showCancelButton?: 'onfocus' | 'always' | 'never'
  onFocus?: () => void
  onBlur?: () => void
  onCancel?: () => void
}

interface SearchBarState {
  cancelButtonWidth: number
  hasFocus: boolean
}

export class SearchBar extends Component<SearchBarProps, SearchBarState> {
  input: NativeMethods | null = null
  animatedCancel: Animated.Value
  
  static defaultProps = {
    showCancelButton: 'onfocus'
  }
  
  constructor(props: SearchBarProps) {
    super(props)
    this.animatedCancel = new Animated.Value(props.showCancelButton === 'always' ? 1 : 0)
  }

  state = {
    cancelButtonWidth: 0,
    hasFocus: false
  }

  focus = () => {
    this.input?.focus()
  }

  blur = () => {
    this.input?.blur()
  }

  cancel = () => {
    this.blur()
    this.props.onCancel?.()
  }

  onFocus = () => {
    this.props.onFocus?.()
    this.setState({ hasFocus: true })
    if (this.props.showCancelButton === 'onfocus') {
      this.startCancelAnimation(1)
    }
  }

  onBlur = () => {
    this.props.onBlur?.()
    this.setState({ hasFocus: false })
    if (this.props.showCancelButton === 'onfocus') {
      this.startCancelAnimation(0)
    }
  }

  startCancelAnimation(toValue: number) {
    Animated.timing(this.animatedCancel, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false
    }).start()
  }

  UNSAFE_componentWillReceiveProps({ showCancelButton }: SearchBarProps) {
    if (showCancelButton !== this.props.showCancelButton) {
      this.startCancelAnimation(
        showCancelButton === 'always' || showCancelButton === 'onfocus' && this.state.hasFocus ? 1 : 0
      )
    }
  }

  render() {
    const {
      cancelButtonTitle,
      style,
      inputStyle,
      showCancelButton,
      onChangeText,
      onSubmit,
      ...props
    } = this.props

    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[
            {
              flex: 1,
              marginRight: this.animatedCancel.interpolate({
                inputRange: [0, 1],
                outputRange: [0, this.state.cancelButtonWidth]
              })
            }
          ]}
        >
          <SearchInput
            {...props}
            ref={(input: NativeMethods) => {
              this.input = input
            }}
            style={{ flex: 0 }}
            inputStyle={inputStyle}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            onChangeText={onChangeText}
            onSubmit={onSubmit}
          />
        </Animated.View>

        {showCancelButton !== 'never' && (
          <Animated.View
            style={[
              styles.cancelButtonContainer,
              {
                opacity: this.animatedCancel,
                right: this.animatedCancel.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-this.state.cancelButtonWidth, 0]
                })
              },
            ]}
            onLayout={event => {
              this.setState({ cancelButtonWidth: event.nativeEvent.layout.width })
            }}
          >
            <Button
              variant="primaryTransparent"
              style={styles.cancelButton}
              title={cancelButtonTitle || t('actions.cancel')}
              onPress={this.cancel} />
          </Animated.View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 10
  },
  cancelButtonContainer: {
    position: 'absolute',
  },
  cancelButton: {
    paddingLeft: 0,
    paddingRight: 8
  }
})
