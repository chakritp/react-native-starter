import React, { Ref, ReactElement, forwardRef, useEffect, useRef, useState } from 'react'
import { Box, ActivityIndicator } from './common'
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
    refreshing = false,
    data,
    offset,
    total,
    canLoadMore = total === undefined || (data && data.length < total),
    onEndReachedThreshold = 0.5,
    onEndReached,
    onLoadMore,
    ...listProps
  } = props

  const listRef = useRef<FlatListElement | null>(null)
  const loadMoreRef = useRef(false)
  const loadMoreEnabledRef = useRef(false)

  if (!loading) {
    loadMoreRef.current = false
  }

  useEffect(() => {
    if (listRef.current && offset === 0) {
      listRef.current.scrollToOffset({ offset: 0 })
    }
  }, [offset])

  useEffect(() => {
    if (refreshing) {
      loadMoreEnabledRef.current = false
    }
  }, [refreshing])

  const [counter, setCounter] = useState(1)
  const showLoadingIndicator = (!data?.length && loading && !refreshing) || loadMoreRef.current

  return (
    <FlatList<T>
      ref={el => {
        listRef.current = el
        if (typeof ref === 'function') {
          ref(el)
        } else if (ref) {
          ref.current = el
        }
      }}
      loading={loading}
      refreshing={refreshing}
      data={data}
      extraData={counter}
      ListFooterComponent={<ListFooter loading={showLoadingIndicator} />}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={({ distanceFromEnd }) => {
        if (loading || refreshing) return
        if (loadMoreEnabledRef.current) {
          loadMoreEnabledRef.current = false
          if (onEndReached) onEndReached({ distanceFromEnd })
          if (canLoadMore && onLoadMore) {
            loadMoreRef.current = true
            onLoadMore()
          }
        }
      }}
      onScrollBeginDrag={() => {
        loadMoreEnabledRef.current = true
      }}
      onMomentumScrollEnd={() => {
        loadMoreEnabledRef.current = false
        setCounter(counter + 1)
      }}
      {...listProps} />
  )
}) as <T>(p: InfiniteListProps<T> & { ref?: Ref<FlatListElement> }) => ReactElement

const ListFooter = ({ loading }: { loading: boolean }) => {
  return (
    <Box alignItems="center" justifyContent="center" p="l">
      {loading ? (
        <ActivityIndicator p="xl" animating size="large" />
      ) : null}
    </Box>
  )
}
