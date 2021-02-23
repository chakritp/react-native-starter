import React, { useMemo, useState } from 'react'
import { useTheme } from 'theme'
import { PickerButton } from '../PickerButton'
import { ModalInput } from '../ModalInput'
import { PickerBase, PlatformPickerProps } from './common'

const PROMPT_VALUE = '@@Picker.PROMPT_VALUE'

export default function PickerIOS({
  style,
  embedded,
  placeholder,
  prompt,
  items,
  selectedItem,
  disabled,
  onValueChange = () => {},
  ...props
}: PlatformPickerProps) {
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
    <>
      <PickerButton
        style={style}
        embedded={embedded}
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
    </>
  )
}
