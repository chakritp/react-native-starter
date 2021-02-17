import React, { Ref, ReactElement, forwardRef, useEffect, useRef, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { FlatList, FlatListProps, FlatListElement } from './lists'

export interface InfiniteListProps<T> extends FlatListProps<T> {
  offset?: number
  total?: number
  canLoadMore?: boolean
  onLoadMore?: (...args: any[]) => any
}

export const InfiniteList = forwardRef(<T, >(props: InfiniteListProps<T>, ref: any) => {
  const {
    loading = false,
    refreshing = loading,
    data,
    offset,
    total,
    canLoadMore = total === undefined || (data && data.length < total),
    onEndReachedThreshold = 0.5,
    onEndReached,
    onLoadMore,
    ...listProps
  } = props

  const list = useRef<FlatListElement | null>(null)

  useEffect(() => {
    if (list.current && offset === 0) {
      list.current.scrollToOffset({ offset: 0 })
    }
  }, [offset])

  const [onEndReachedCalledDuringScroll, setOnEndReachedCalledDuringScroll] = useState(false)
  const [counter, setCounter] = useState(1)

  return (
    <FlatList<T>
      ref={el => {
        list.current = el
        if (ref) ref(el)
      }}
      ListFooterComponent={<ListFooter data={data} loading={loading} />}
      loading={loading}
      refreshing={refreshing}
      data={data}
      extraData={counter}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={({ distanceFromEnd }) => {
        if (loading || refreshing) return
        if (onEndReachedCalledDuringScroll === false) {
          setOnEndReachedCalledDuringScroll(true)
          if (onEndReached) onEndReached({ distanceFromEnd })
          if (canLoadMore && onLoadMore) onLoadMore()
        }
      }}
      onScrollBeginDrag={() => setOnEndReachedCalledDuringScroll(false)}
      onMomentumScrollEnd={() => setCounter(counter + 1)}
      {...listProps} />
  )
}) as <T>(p: InfiniteListProps<T> & { ref?: Ref<FlatListElement> }) => ReactElement

const ListFooter = ({ data, loading }: { data: any, loading: boolean }) => {
  const styles = useStyles(themedStyles)

  return (
    <View style={styles.listFooter}>
      {data && data.length && loading ? (
        <ActivityIndicator style={styles.activityIndicator} animating size="large" />
      ) : null}
    </View>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  listFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.l
  },
  activityIndicator: {
    padding: theme.spacing.xl
  }
}))
