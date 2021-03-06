import { IOSNativeProps } from '@react-native-community/datetimepicker'
import { StyleProp, ViewStyle } from 'react-native'

export type DateTimePickerBaseProps = {
  style?: StyleProp<ViewStyle>
  display?: 'default' | 'spinner'
  mode?: 'date' | 'time'
  textColor?: string
  maximumDate?: Date
  minimimDate?: Date
  minuteInterval?: IOSNativeProps['minuteInterval']
  defaultValue: Date
  clearable?: boolean
  value?: Date
  open?: boolean
  onChange?: (value?: Date) => void
  onClose?: () => void
}
