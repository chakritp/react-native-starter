import React, { useMemo, useState } from 'react'
import { View } from 'react-native'
import { useTheme } from 'theme'
import { ButtonInput, ModalInput } from '../common'
import PickerBase from './PickerBase'

const PROMPT_VALUE = '@@Picker.PROMPT_VALUE'

export default function PickerIOS({
  inline,
  placeholder,
  prompt,
  items,
  selectedItem,
  disabled,
  onValueChange = () => {},
  ...props
}) {
  const theme = useTheme()
  const _items = useMemo(() => {
    if (prompt) {
      return [{ value: PROMPT_VALUE, label: prompt }, ...items]
    }
    return items
  }, [items, prompt])
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <View>
      <ButtonInput
        inline={inline}
        placeholder={placeholder}
        value={selectedItem && selectedItem.label}
        disabled={disabled}
        onPress={() => setOpen(true)} />

      <ModalInput
        visible={open}
        onClose={close}>
        <PickerBase
          onValueChange={(value, index) => {
            if (value !== PROMPT_VALUE) {
              close()
              onValueChange(value, index)
            }
          }}
          style={{ backgroundColor: theme.colors.modalInputContent }}
          items={_items}
          {...props} />
      </ModalInput>
    </View>
  )
}
