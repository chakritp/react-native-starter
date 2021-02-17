import React, { useMemo, useRef } from 'react'
import { SafeArea, FlatList, FlatListElement, ListItem } from 'components/core'

interface Item {
  id: string
  name: string
}

export default () => {
  const listRef = useRef<FlatListElement>(null)
  
  const data = useMemo(() => {
    return new Array(50).fill(0).map((_, i) => {
      return { id: `${i}`, name: `Item ${i}` } as Item
    })
  }, [])

  return (
    <SafeArea safe="top">
      <FlatList<Item>
        ref={listRef}
        data={data}
        itemSeparator
        renderItem={({ item }) => <ListItem title={item.name} chevron />}
      />
    </SafeArea>
  )
}
