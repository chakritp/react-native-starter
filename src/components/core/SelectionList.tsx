import noop from 'lodash/noop'
import React, { useRef, useState } from 'react'
import { View, KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native'
import { ThemeColor } from 'theme'
import { Container, ContainerProps } from './layout'
import { InfiniteListProps, InfiniteList } from './InfiniteList'
import { LoadingOverlay } from './LoadingOverlay'
import { ListItem, ListItemProps } from './ListItem'
import { SearchBar, SearchBarProps } from './SearchBar'
import { FlatListElement } from './lists'

export interface SelectionListProps<T> extends Omit<SearchBarProps, 'value' | 'onChange' | 'onChangeText'>, Pick<Omit<InfiniteListProps<T>, 'onLoadMore' | 'onRefresh' | 'refreshing'>,
  'total' |
  'loading' |
  'canLoadMore' |
  'keyExtractor' |
  'itemSeparator' |
  'emptyText'
> {
  style?: StyleProp<ViewStyle>
  backgroundColor?: ThemeColor
  bg?: ThemeColor
  safe?: ContainerProps['safe']
  searchBar?: boolean
  placeholder?: string
  items?: T[]
  itemPropsExtractor: (item: T) => ListItemProps
  refreshControl?: boolean
  onLoad?: (query: string) => void
  onLoadMore?: (query: string) => void
  onSelect?: (item: T) => void
  onDone?: () => void
}

export const SelectionList = <T, >({
  style,
  backgroundColor = "mainBackgroundMuted",
  bg,
  safe = 'bottom',
  searchBar,
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
  onLoad = noop,
  onSelect = noop,
  onDone = noop,
  ...searchBarProps
}: SelectionListProps<T>) => {
  const list = useRef<FlatListElement | null>(null)
  const refreshingRef = useRef(false)
  const [query, setQuery] = useState('')
  const done = () => {
    setQuery('')
    onDone()
  }

  if (!loading) {
    refreshingRef.current = false
  }

  return (
    <Container style={style} flex={1} backgroundColor={backgroundColor} bg={bg} safe={safe}>
      {searchBar && (
        <SearchBar
          autoFocus
          showCancel
          placeholder={placeholder}
          value={query}
          onChangeText={setQuery}
          onSubmit={query => {
            onLoad(query)
            if (items) {
              list.current!.scrollToOffset({ offset: 0 })
            }
          }}
          onCancel={done}
          {...searchBarProps} />
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={{ flex: 1 }}>
          <InfiniteList
            ref={el => {
              list.current = el
            }}
            style={Platform.OS === 'android' && { minHeight: '100%' }}
            itemSeparator={itemSeparator}
            loading={onLoadMore ? loading : false}
            refreshing={refreshingRef.current}
            data={items}
            total={total}
            canLoadMore={canLoadMore}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => (
              <ListItem
                {...itemPropsExtractor!(item)}
                onPress={() => {
                  done()
                  onSelect(item)
                }} />
            )}
            onRefresh={refreshControl ? () => {
              refreshingRef.current = true
              onLoad(query)
            } : undefined}
            onLoadMore={onLoadMore ? () => onLoadMore(query) : undefined}
            emptyText={emptyText} />

          <LoadingOverlay backgroundColor={backgroundColor} bg={bg} show={!items && loading} />
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

SelectionList.defaultProps = {
  keyExtractor: (item: any) => `${item.id}`
}
