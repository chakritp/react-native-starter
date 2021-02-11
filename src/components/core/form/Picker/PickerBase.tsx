import React from 'react'
import { Picker as RNPicker } from '@react-native-picker/picker'

export default function Picker({ items, ...props }) {
  return (
    <RNPicker {...props}>
      {items.map(item => <RNPicker.Item key={`${item.value}`} {...item} />)}
    </RNPicker>
  )
}
