import { useMemo, useState } from 'react'
import Chance from 'chance'

interface MockCollectionItem {
  id: number
  name: string
  description: string
}

interface MockCollectionState {
  loading: boolean
  page: number
  items: MockCollectionItem[]
}

export const useMockCollection = () => {
  const chance = useMemo(() => new Chance(1), [])

  const allItems = useMemo(() => (
    new Array(50).fill(0).map((_, i) => ({
      id: i + 1,
      name: chance.city(),
      description: chance.sentence()
    }))
  ), [])

  let [collectionState, setCollectionState] = useState<MockCollectionState>({ loading: false, page: 1, items: [] })
  
  const load = (query: string = '', page = 1) => {
    const queryLc = query.toLowerCase()
    collectionState = { ...collectionState, loading: true }
    setCollectionState(collectionState)
    setTimeout(() => {
      const newItems = query
        ? allItems.filter(item => item.name.toLowerCase().indexOf(queryLc) > -1)
        : allItems
      collectionState = { loading: false, items: newItems.slice(0, page * 20), page }
      setCollectionState(collectionState)
    }, 500)
  }

  const loadMore = (query: string) => {
    load(query, collectionState.page + 1)
  }

  const reset = () => {
    collectionState = { loading: false, page: 1, items: [] }
    setCollectionState(collectionState)
    load('')
  }

  return {
    ...collectionState,
    allItems,
    load,
    loadMore,
    reset
  }
}
