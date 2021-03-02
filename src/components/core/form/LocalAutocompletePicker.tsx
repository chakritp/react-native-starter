import React, { useCallback, useState } from 'react'
import { AutocompletePicker, AutocompletePickerProps } from './AutocompletePicker'

export interface LocalAutocompletePickerProps<T, P> extends AutocompletePickerProps<T, P> {
  itemSearchStringExtractor?: (item: T) => string
}

export const LocalAutocompletePicker = <T, P>({
  value,
  itemLabelExtractor,
  itemSearchStringExtractor = itemLabelExtractor,
  items = [],
  ...props
}: LocalAutocompletePickerProps<T, P>) => {
  const [filteredItems, setFilteredItems] = useState(items)

  const onLoad = useCallback(query => {
    const queryLc = query.toLowerCase()
    setFilteredItems(items.filter(item => {
      return itemSearchStringExtractor(item).toLowerCase().indexOf(queryLc) > -1
    }))
  }, [items])

  return (
    <AutocompletePicker
      refreshControl={false}
      itemLabelExtractor={itemLabelExtractor}
      items={filteredItems}
      value={value}
      submitDelay={0}
      onLoad={onLoad}
      {...props} />
  )
}
