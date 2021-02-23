import React, { useState } from 'react'
import { StyleProp, ViewStyle, TextStyle } from 'react-native'
import moment from 'moment'
import { useTheme } from 'theme'
import { PickerButton } from '../PickerButton'
import { DateTimePickerBaseProps } from './common'
import PlatformDateTimePicker from './DateTimePicker'

export interface DateTimePickerProps extends Partial<DateTimePickerBaseProps> {
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  embedded?: boolean
  disabled?: boolean
  format?: string
  placeholder?: string
}

export const DateTimePicker = ({
  style,
  titleStyle,
  embedded,
  disabled,
  mode = 'date',
  format = 'll',
  placeholder,
  defaultValue = moment().startOf('day').toDate(),
  value,
  onChange = () => {},
  ...props
}: DateTimePickerProps) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <PickerButton
        style={style}
        titleStyle={titleStyle}
        embedded={embedded}
        placeholder={placeholder}
        value={value ? moment(value).format(format) : ''}
        disabled={disabled}
        onPress={() => setOpen(true)} />

      <PlatformDateTimePicker
        style={{ backgroundColor: theme.colors.modalInputContent }}
        display="spinner"
        textColor={theme.colors.inputText}
        mode={mode}
        defaultValue={defaultValue}
        value={value}
        open={open}
        onClose={close}
        onChange={onChange}
        {...props} />
    </>
  )
}
