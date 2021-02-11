import React, { Component } from 'react'
import {
  LayoutAnimation,
  UIManager,
  View,
  StyleSheet
} from 'react-native'
import { t } from 'helpers/i18n'
import { Button } from './Button'
import { SearchInput } from './form/SearchInput'

// Android support.
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

export class SearchBar extends Component {
  state = {
    hasFocus: false,
    cancelButtonWidth: null
  }

  focus = () => {
    this.input.focus()
  }

  blur = () => {
    this.input.blur()
  }

  cancel = () => {
    if (this.props.showCancel) {
      UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut()
      this.setState({ hasFocus: false })
    }

    setTimeout(() => {
      this.blur()
      this.props.onCancel()
    }, 0)
  }

  onFocus = () => {
    this.props.onFocus()
    UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut()
    this.setState({ hasFocus: true })
  }

  onBlur = () => {
    this.props.onBlur()
    UIManager.configureNextLayoutAnimation && LayoutAnimation.easeInEaseOut()

    if (!this.props.showCancel) {
      this.setState({
        hasFocus: false,
      })
    }
  }

  onChangeText = text => {
    this.props.onChangeText(text)
  }

  render() {
    const {
      cancelButtonTitle,
      style,
      inputStyle,
      showCancel,
      onSubmit,
      ...props
    } = this.props
    const { hasFocus } = this.state

    return (
      <View style={[styles.container, style]}>
        <SearchInput
          {...props}
          ref={input => {
            this.input = input
          }}
          style={[
            styles.input,
            hasFocus && { marginRight: this.state.cancelButtonWidth }
          ]}
          inputStyle={inputStyle}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onChangeText={this.onChangeText}
          onSubmit={onSubmit}
        />

        {showCancel && (
          <View
            style={[
              styles.cancelButtonContainer,
              {
                opacity: this.state.cancelButtonWidth === null ? 0 : 1,
                right: hasFocus ? 0 : -this.state.cancelButtonWidth,
              },
            ]}
            onLayout={event =>
              this.setState({ cancelButtonWidth: event.nativeEvent.layout.width })
            }
          >
            <Button
              transparent
              contentStyle={styles.cancelButton}
              title={cancelButtonTitle}
              onPress={this.cancel} />
          </View>
        )}
      </View>
    )
  }
}

SearchBar.defaultProps = {
  cancelButtonTitle: t('actions.cancel'),
  showCancel: false,
  onClear: () => null,
  onCancel: () => null,
  onFocus: () => null,
  onBlur: () => null,
  onChangeText: () => null
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 10
  },
  input: {
    flex: 1,
  },
  cancelButtonContainer: {
    position: 'absolute',
  },
  cancelButton: {
    paddingLeft: 0,
    paddingRight: 8
  }
})
