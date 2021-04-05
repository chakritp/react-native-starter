import React, { useRef, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { ThemeColor } from 'theme'
import { Container, ContainerProps } from './layout'
import { InfiniteListProps, InfiniteList } from './InfiniteList'
import { ListItem, ListItemProps } from './ListItem'
import { SearchBar, SearchBarProps } from './SearchBar'
import { FlatListElement } from './lists'

export interface SelectionListProps<T> extends Pick<Omit<InfiniteListProps<T>, 'onLoadMore' | 'onRefresh' | 'refreshing'>,
  'total' |
  'loading' |
  'canLoadMore' |
  'keyExtractor' |
  'itemSeparator' |
  'emptyText'
> {
  style?: StyleProp<ViewStyle>
  bg?: ThemeColor
  safe?: ContainerProps['safe']
  searchBar?: boolean
  searchBarAutoFocus?: boolean
  showCancelButton?: SearchBarProps['showCancelButton']
  submitDelay?: number
  placeholder?: string
  items?: T[]
  itemPropsExtractor: (item: T) => ListItemProps
  refreshControl?: boolean
  onLoad?: (query: string) => void
  onLoadMore?: (query: string) => void
  onSelect?: (item: T) => void
  onCancel?: () => void
}

export const SelectionList = <T, >({
  style,
  bg = "mainBackgroundMuted",
  safe = 'bottom',
  searchBar,
  searchBarAutoFocus,
  showCancelButton,
  submitDelay,
  itemSeparator = true,
  placeholder,
  loading,
  items,
  total,
  canLoadMore,
  refreshControl,
  emptyText,
  keyExtractor,
  itemPropsExtractor,
  onLoadMore,
  onLoad,
  onSelect,
  onCancel,
}: SelectionListProps<T>) => {
  const listRef = useRef<FlatListElement | null>(null)
  const searchBarRef = useRef<any>(null)
  const [query, setQuery] = useState('')

  return (
    <Container style={style} flex={1} bg={bg} safe={safe}>
      {searchBar && (
        <SearchBar
          ref={searchBarRef}
          autoFocus={searchBarAutoFocus}
          showCancelButton={showCancelButton}
          submitDelay={submitDelay}
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
          onSubmit={query => {
            onLoad?.(query)
            if (items) {
              listRef.current?.scrollToOffset({ offset: 0 })
            }
          }}
          onCancel={() => {
            setQuery('')
            onCancel?.()
          }}
        />
      )}

      <InfiniteList
        ref={listRef}
        itemSeparator={itemSeparator}
        loading={onLoadMore ? loading : false}
        data={items}
        total={total}
        canLoadMore={canLoadMore}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <ListItem
            {...itemPropsExtractor(item)}
            onPress={() => onSelect?.(item)} />
        )}
        onRefresh={refreshControl ? () => {
          onLoad?.(query)
        } : undefined}
        onLoadMore={onLoadMore ? () => onLoadMore(query) : undefined}
        onScrollBeginDrag={() => searchBarRef.current?.blur()}
        emptyText={emptyText} />
    </Container>
  )
}

SelectionList.defaultProps = {
  keyExtractor: (item: any) => `${item.id}`
}
