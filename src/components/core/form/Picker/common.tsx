import React from 'react'
import { Picker as $Picker } from '@react-native-picker/picker'

export interface PickerItem {
  label: string
	value?: number | string
	testID?: string
}

type $PickerProps = ConstructorParameters<typeof $Picker>[0]

export interface PickerBaseProps extends $PickerProps {
  items: PickerItem[]
}

export interface PlatformPickerProps extends PickerBaseProps {
  inline?: boolean
  selectedItem?: PickerItem
  disabled?: boolean
  placeholder?: string
}

export const PickerBase = ({ items, ...props }: PickerBaseProps) => (
  <$Picker {...props}>
    {items.map(item => <$Picker.Item key={`${item.value}`} {...item} />)}
  </$Picker>
)
