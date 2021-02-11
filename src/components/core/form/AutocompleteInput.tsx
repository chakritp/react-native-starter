import debounce from 'lodash/debounce'
import noop from 'lodash/noop'
import React, { PureComponent } from 'react'
import { TextInput } from './TextInput'

export class AutocompleteInput extends PureComponent {
  static defaultProps = {
    submitDelay: 300,
    onChangeText: noop,
    onSubmit: noop
  }

  state = {
    submittedValue: ''
  }

  constructor(props) {
    super(props)

    this.submit = value => {
      value = value.trim()

      if (value !== this.state.submittedValue) {
        this.setState({ submittedValue: value })
        this.props.onSubmit(value)
      }
    }

    this.debouncedSubmit = debounce(this.submit, props.submitDelay)
  }

  componentWillUnmount() {
    this.debouncedSubmit.cancel()
  }

  focus = () => {
    this.input.focus()
  }

  blur = () => {
    this.input.blur()
  }

  onChangeText = value => {
    value = value.trimLeft()
    this.props.onChangeText(value)
    this.debouncedSubmit(value)
  }

  onClear = () => {
    this.debouncedSubmit.cancel()
    this.props.onChangeText('')
    this.submit('')
  }

  render() {
    const { value, onChangeText: _, ...props } = this.props

    return (
      <TextInput
        ref={input => {
          this.input = input
        }}
        rightIcon={value !== '' && {
          name: 'clear',
          size: 's',
          color: 'textMuted',
          onPress: this.onClear
        }}
        accessibilityRole="search"
        autoCapitalize="none"
        autoCompleteType="off"
        autoCorrect={false}
        returnKeyType="search"
        value={value}
        onChangeText={this.onChangeText}
        {...props} />
    )
  }
}
