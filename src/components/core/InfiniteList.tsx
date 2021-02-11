import noop from 'lodash'
import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { createThemedStyleSheet, useStyles } from 'theme'
import { FlatList } from './lists'

export const InfiniteList = forwardRef(({
  loading,
  refreshing = loading,
  data,
  offset,
  total,
  canLoadMore = total === undefined || (data && data.length < total),
  onEndReachedThreshold,
  onEndReached,
  onLoadMore,
  ...props
}, ref) => {
  const list = useRef()

  useEffect(() => {
    if (list.current && offset === 0) {
      list.current.scrollToOffset({ offset: 0 })
    }
  }, [offset])

  const [onEndReachedCalledDuringScroll, setOnEndReachedCalledDuringScroll] = useState()
  const [counter, setCounter] = useState(1)

  return (
    <FlatList
      ref={el => {
        list.current = el
        ref && ref(el)
      }}
      ListFooterComponent={<ListFooter data={data} loading={loading} />}
      loading={loading}
      refreshing={refreshing}
      data={data}
      extraData={counter}
      onEndReachedThreshold={onEndReachedThreshold}
      onEndReached={() => {
        if (loading || refreshing) return
        if (onEndReachedCalledDuringScroll === false) {
          setOnEndReachedCalledDuringScroll(true)
          onEndReached()
          if (canLoadMore) onLoadMore()
        }
      }}
      onScrollBeginDrag={() => setOnEndReachedCalledDuringScroll(false)}
      onMomentumScrollEnd={() => setCounter(counter + 1)}
      {...props} />
  )
})

InfiniteList.defaultProps = {
  refreshing: false,
  onEndReachedThreshold: 0.5,
  onEndReached: noop,
  onLoadMore: noop
}

const ListFooter = ({ data, loading }) => {
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
