import React, { useState } from 'react'
import { StyleProp, ViewStyle, TextStyle } from 'react-native'
import { startOfDay } from 'date-fns'
import { useTheme } from '@shopify/restyle'
import { formatDate } from 'helpers/i18n'
import { Theme } from 'theme'
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
  accessibilityLabel?: string
}

export const DateTimePicker = ({
  style,
  titleStyle,
  embedded,
  disabled,
  mode = 'date',
  format = mode === 'time' ? 'p' : 'PP',
  placeholder,
  accessibilityLabel = placeholder,
  defaultValue = startOfDay(new Date()),
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
        value={value ? formatDate(value, format) : ''}
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
