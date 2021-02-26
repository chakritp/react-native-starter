import noop from 'lodash/noop'
import React, { useCallback, useMemo, useState } from 'react'
import { Modal, StyleProp, ViewStyle } from 'react-native'
import { IconButton } from '../IconButton'
import { PickerButton } from './PickerButton'
import { SelectionList, SelectionListProps } from '../SelectionList'

export interface AutocompletePickerProps<T, P> extends Omit<SelectionListProps<T>, 'itemPropsExtractor'> {
  style?: StyleProp<ViewStyle>
  embedded?: boolean
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  hasError?: boolean
  itemLabelExtractor: (item: T) => string
  itemValueExtractor?: (item: T) => any
  itemPropsExtractor?: SelectionListProps<T>['itemPropsExtractor']
  value?: P
  onOpen?: () => void
  onChange?: (value: P | null) => void
}

export const AutocompletePicker = <T, P>({
  style,
  embedded,
  placeholder,
  itemLabelExtractor,
  itemValueExtractor,
  itemPropsExtractor = (item: T) => {
    return { title: itemLabelExtractor(item) }
  },
  items = [],
  value,
  clearable,
  disabled,
  hasError: _hasError,
  onOpen = noop,
  onLoad = noop,
  onChange = noop,
  ...props
}: AutocompletePickerProps<T, P>) => {
  const [open, setOpen] = useState(false)

  const selectedItem = useMemo(() => {
    return items.find(item => itemValueExtractor!(item) === value)
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
    <>
      <PickerButton
        style={style}
        embedded={embedded}
        placeholder={placeholder}
        value={selectedItem && itemLabelExtractor(selectedItem)}
        disabled={disabled}
        icon={value && clearable ? (
          <IconButton
            name="clear"
            position="absolute"
            pt="xxxs"
            mr="xs"
            right={0}
            size="m"
            onPress={() => onChange(null)} />
        ) : undefined}
        onPress={handleOpen} />

      <Modal
        animationType="slide"
        visible={open}
        onRequestClose={close}>    
        <SelectionList
          safe="top"
          searchBar
          itemPropsExtractor={itemPropsExtractor}
          items={items}
          onSelect={item => onChange(itemValueExtractor!(item))}
          onDone={close}
          onLoad={onLoad}
          {...props} />
      </Modal>
    </>
  )
}

AutocompletePicker.defaultProps = {
  itemValueExtractor: (item: any) => item.id
}