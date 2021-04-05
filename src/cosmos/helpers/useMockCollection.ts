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

export const useMockCollection = (total = 50) => {
  const chance = useMemo(() => new Chance(1), [])

  const allItems = useMemo(() => (
    new Array(total).fill(0).map((_, i) => ({
      id: i + 1,
      name: chance.city(),
      description: chance.sentence()
    }))
  ), [total])

  let [collectionState, setCollectionState] = useState<MockCollectionState>({ loading: false, page: 1, items: [] })
  
  const load = (query: string = '', page = 1) => {
    const queryLc = query.toLowerCase()
    setCollectionState({ ...collectionState, loading: true })
    setTimeout(() => {
      const newItems = query
        ? allItems.filter(item => item.name.toLowerCase().indexOf(queryLc) > -1)
        : allItems
      setCollectionState({ loading: false, items: newItems.slice(0, page * 20), page })
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
    total: allItems.length,
    load,
    loadMore,
    reset
  }
}
