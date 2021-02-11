import React, { useState } from 'react'
import moment from 'moment'
import { useTheme } from 'theme'
import { InputContainer, ButtonInput } from '../common'
import { PlatformDateTimePicker } from './DateTimePicker'

export const DateTimePicker = ({
  style,
  labelStyle,
  labelTextStyle,
  inputStyle,
  inline,
  label,
  mode = 'date',
  format = 'll',
  placeholder,
  defaultValue = moment().startOf('day').toDate(),
  value,
  disabled,
  onChange = () => {},
  ...props
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <InputContainer
      style={style}
      labelStyle={labelStyle}
      labelTextStyle={labelTextStyle}
      inline={inline}
      label={label}
      disabled={disabled}>

      <ButtonInput
        titleStyle={inputStyle}
        inline={inline}
        placeholder={placeholder}
        value={value ? moment(value).format(format) : ''}
        disabled={disabled}
        onPress={() => setOpen(true)} />

      <PlatformDateTimePicker
        display="spinner"
        textColor={theme.colors.inputText}
        style={{ backgroundColor: theme.colors.modalInputContent }}
        mode={mode}
        defaultValue={defaultValue}
        value={value}
        open={open}
        close={close}
        onChange={onChange}
        {...props} />
    </InputContainer>
  )
}
