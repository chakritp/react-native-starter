import noop from 'lodash/identity'
import React, { useRef, useState } from 'react'
import { View, KeyboardAvoidingView, Platform } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Container } from './layout'
import { InfiniteList } from './InfiniteList'
import { LoadingOverlay } from './LoadingOverlay'
import { ListItem } from './ListItem'
import { SearchBar } from './SearchBar'

export const SelectionList = ({
  safe = 'bottom',
  style,
  searchBar,
  itemSeparator = true,
  placeholder,
  loading,
  refreshing,
  items,
  total,
  canLoadMore,
  keyExtractor,
  itemPropsExtractor,
  emptyText,
  onLoad,
  onLoadMore,
  onRefresh,
  onSelect,
  onDone,
  ...props
}) => {
  const styles = useStyles(themedStyles)
  const list = useRef()
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
              list.current.scrollToOffset({ offset: 0 })
            }
          }}
          onCancel={done}
          {...props} />
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
                {...itemPropsExtractor(item)}
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
  itemPropsExtractor: item => ({ title: item.label }),
  keyExtractor: item => `${item.value}`,
  onSelect: noop,
  onDone: noop
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
