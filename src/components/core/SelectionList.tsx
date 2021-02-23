import noop from 'lodash/noop'
import React, { useRef, useState } from 'react'
import { View, KeyboardAvoidingView, Platform, StyleProp, ViewStyle } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Container, ContainerProps } from './layout'
import { InfiniteListProps, InfiniteList } from './InfiniteList'
import { LoadingOverlay } from './LoadingOverlay'
import { ListItem, ListItemProps } from './ListItem'
import { SearchBar, SearchBarProps } from './SearchBar'
import { FlatListElement } from './lists'

export interface SelectionListProps<T> extends Omit<SearchBarProps, 'value' | 'onChange' | 'onChangeText'>, Pick<Omit<InfiniteListProps<T>, 'onLoadMore' | 'onRefresh'>,
  'total' |
  'loading' |
  'refreshing' |
  'canLoadMore' |
  'keyExtractor' |
  'itemSeparator' |
  'emptyText'
> {
  style?: StyleProp<ViewStyle>
  safe?: ContainerProps['safe']
  searchBar?: boolean
  placeholder?: string
  items?: T[]
  itemPropsExtractor: (item: T) => ListItemProps
  onLoad?: (query: string) => void
  onLoadMore?: (query: string) => void
  onRefresh?: (query: string) => void
  onSelect?: (item: T) => void
  onDone?: () => void
}

export const SelectionList = <T, >({
  style,
  safe = 'bottom',
  searchBar,
  itemSeparator = true,
  placeholder,
  loading,
  refreshing,
  items,
  total,
  canLoadMore,
  emptyText,
  keyExtractor,
  itemPropsExtractor,
  onLoadMore,
  onRefresh,
  onLoad = noop,
  onSelect = noop,
  onDone = noop,
  ...searchBarProps
}: SelectionListProps<T>) => {
  const styles = useStyles(themedStyles)
  const list = useRef<FlatListElement | null>(null)
  const [query, setQuery] = useState('')
  const done = () => {
    setQuery('')
    onDone()
  }

  return (
    <Container style={[styles.container, style]} safe={safe}>
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
            refreshing={refreshing}
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
            onRefresh={onRefresh && (() => onRefresh(query))}
            onLoadMore={onLoadMore ? () => onLoadMore(query) : undefined}
            emptyText={emptyText} />

          <LoadingOverlay style={styles.loadingOverlay} show={!items && loading} />
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}

SelectionList.defaultProps = {
  keyExtractor: (item: any) => `${item.id}`
}

const themedStyles = createThemedStyleSheet(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.containerMutedBg
  },
  loadingOverlay: {
    backgroundColor: theme.colors.containerMutedBg
  }
}))
