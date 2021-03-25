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
  onDone?: () => void
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
  onLoad = noop,
  onSelect = noop,
  onDone = noop
}: SelectionListProps<T>) => {
  const list = useRef<FlatListElement | null>(null)
  const searchBarRef = useRef<any>(null)
  const [query, setQuery] = useState('')
  const done = () => {
    setQuery('')
    onDone()
  }

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
            onLoad(query)
            if (items) {
              list.current?.scrollToOffset({ offset: 0 })
            }
          }}
          onCancel={done}
        />
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
              onLoad(query)
            } : undefined}
            onLoadMore={onLoadMore ? () => onLoadMore(query) : undefined}
            onScrollBeginDrag={() => searchBarRef.current?.blur()}
            emptyText={emptyText} />

          <LoadingOverlay bg={bg} show={!items && loading} />
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

SelectionList.defaultProps = {
  keyExtractor: (item: any) => `${item.id}`
}
