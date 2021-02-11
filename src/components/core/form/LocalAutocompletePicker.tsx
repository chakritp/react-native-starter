import React, { useCallback, useState } from 'react'
import { AutocompletePicker } from './AutocompletePicker'

export const LocalAutocompletePicker = ({
  value,
  items = [],
  ...props
}) => {
  const [filteredItems, setFilteredItems] = useState(items)

  const onLoad = useCallback(query => {
    setFilteredItems(items.filter(item => {
      if (item.value && ~item.value.toLowerCase().indexOf(query)) return true
      if (item.label && ~item.label.toLowerCase().indexOf(query)) return true
    }))
  }, [items])

  return (
    <AutocompletePicker
      items={filteredItems}
      value={value}
      submitDelay={0}
      onLoad={onLoad}
      {...props} />
  )
}
