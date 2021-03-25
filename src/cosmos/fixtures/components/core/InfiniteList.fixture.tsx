import React, { useEffect, useRef } from 'react'
import { SafeArea, InfiniteList, FlatListElement, ListItem } from 'components/core'
import { useMockCollection } from 'cosmos/helpers'

export default () => {
  const listRef = useRef<FlatListElement>(null)
  const collection = useMockCollection()

  useEffect(() => {
    collection.load()
  }, [])
  
  return (
    <SafeArea safe="top">
      <InfiniteList
        ref={listRef}
        loading={collection.loading}
        total={collection.allItems.length}
        data={collection.items}
        itemSeparator
        renderItem={({ item }) => <ListItem title={item.name} subtitle={item.description} chevron />}
        onLoadMore={collection.loadMore}
      />
    </SafeArea>
  )
}
