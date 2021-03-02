import Chance from 'chance'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { SafeArea, InfiniteList, FlatListElement, ListItem } from 'components/core'

const chance = new Chance(1)

interface Item {
  id: number
  name: string
  description: string
}

interface Collection {
  loading: boolean
  page: number
  items?: Item[]
}

export default () => {
  const listRef = useRef<FlatListElement>(null)
  const allItems = useMemo(() => (
    new Array(100).fill(0).map((_, i) => ({ id: i + 1, name: chance.city(), description: chance.sentence() }))
  ), [])
  const [collection, setCollection] = useState<Collection>({ loading: false, page: 1 })

  const loadItems = (page = 1) => {
    setCollection({ ...collection, loading: true })
    setTimeout(() => {
      setCollection({ loading: false, items: allItems.slice(0, page * 20), page })
    }, 300)
  }

  const loadMoreItems = () => {
    loadItems(collection.page + 1)
  }

  useEffect(() => {
    loadItems()
  }, [])
  
  return (
    <SafeArea safe="top">
      <InfiniteList<Item>
        ref={listRef}
        loading={collection.loading}
        total={allItems.length}
        data={collection.items}
        itemSeparator
        renderItem={({ item }) => <ListItem title={item.name} subtitle={item.description} chevron />}
        onLoadMore={loadMoreItems}
      />
    </SafeArea>
  )
}
