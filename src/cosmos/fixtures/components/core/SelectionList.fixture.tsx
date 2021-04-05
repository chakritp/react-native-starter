import React, { useEffect } from 'react'
import { useSelect } from 'react-cosmos/fixture'
import { SelectionList, Toast } from 'components/core'
import { useMockCollection } from 'cosmos/helpers'

export default () => {
  const collection = useMockCollection()
  
  const [showCancelButton] = useSelect('showCancelButton', {
    options: ['onfocus', 'always', 'never']
  })

  useEffect(() => {
    collection.load()
  }, [])

  return (
    <SelectionList
      safe="top"
      searchBar
      showCancelButton={showCancelButton}
      refreshControl
      loading={collection.loading}
      items={collection.items}
      itemPropsExtractor={item => ({ title: item.name, subtitle: item.description })}
      onLoad={collection.load}
      onLoadMore={collection.loadMore}
      onSelect={item => Toast.info(`Selected "${item.name}"`)}
      onCancel={() => collection.load('')} />
  )
}
