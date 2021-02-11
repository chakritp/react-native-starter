import noop from 'lodash/identity'
import React, { useCallback, useMemo, useState } from 'react'
import { Modal } from 'react-native'
import { InputContainer, ButtonInput } from './common'
import { SelectionList } from '../SelectionList'

export const AutocompletePicker = ({
  style,
  labelStyle,
  labelTextStyle,
  inputStyle,
  inline,
  label,
  placeholder,
  items = [],
  value,
  clearable,
  disabled,
  hasError: _hasError,
  onOpen,
  onLoad,
  onChange,
  ...props
}) => {
  const [open, setOpen] = useState(false)

  const selectedItem = useMemo(() => {
    return items.find(item => item.value === value)
  }, [items, value])

  const handleOpen = useCallback(() => {
    setOpen(true)
    onLoad('')
    onOpen()
  }, [onOpen])

  const close = () => {
    setOpen(false)
  }

  return (
    <InputContainer
      style={style}
      labelStyle={labelStyle}
      labelTextStyle={labelTextStyle}
      inline={inline}
      label={label}
      disabled={disabled}
      onLabelPress={handleOpen}
    >
      <ButtonInput
        style={inputStyle}
        inline={inline}
        placeholder={placeholder}
        value={selectedItem && selectedItem.label}
        disabled={disabled}
        icon={!!(value && clearable) && {
          name: 'clear',
          onPress: () => onChange(null)
        }}
        onPress={handleOpen} />

      <Modal
        animationType="slide"
        visible={open}
        onRequestClose={close}>    
        <SelectionList
          safe="top"
          searchBar
          items={items}
          onSelect={item => onChange(item.value)}
          onDone={close}
          onLoad={onLoad}
          {...props} />
      </Modal>
    </InputContainer>
  )
}

AutocompletePicker.defaultProps = {
  onOpen: noop,
  onValueChange: noop
}
