import React, { useState } from 'react'
import { StyleProp, ViewStyle, TextStyle } from 'react-native'
import moment from 'moment'
import { useTheme } from '@shopify/restyle'
import { PickerButton } from '../PickerButton'
import { DateTimePickerBaseProps } from './common'
import PlatformDateTimePicker from './DateTimePicker'
import { Theme } from 'theme'

export interface DateTimePickerProps extends Partial<DateTimePickerBaseProps> {
  style?: StyleProp<ViewStyle>
  titleStyle?: StyleProp<TextStyle>
  embedded?: boolean
  disabled?: boolean
  format?: string
  placeholder?: string
  accessibilityLabel?: string
}

export const DateTimePicker = ({
  style,
  titleStyle,
  embedded,
  disabled,
  mode = 'date',
  format = 'll',
  placeholder,
  accessibilityLabel = placeholder,
  defaultValue = moment().startOf('day').toDate(),
  value,
  onChange,
  ...props
}: DateTimePickerProps) => {
  const theme = useTheme<Theme>()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <PickerButton
        style={style}
        titleStyle={titleStyle}
        embedded={embedded}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel}
        value={value ? moment(value).format(format) : ''}
        disabled={disabled}
        onPress={() => setOpen(true)} />

      <PlatformDateTimePicker
        style={{ backgroundColor: theme.colors.modalInputBackground }}
        display="spinner"
        textColor={theme.colors.inputForegroundRegular}
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
