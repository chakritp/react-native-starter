import React, { forwardRef, useEffect, useRef } from 'react'
import { View, FlatList as $FlatList, RefreshControl, StyleSheet } from 'react-native'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { t } from 'helpers/i18n'
import { Text } from './Text'

export const List = ({
  style,
  data,
  emptyText,
  keyExtractor,
  renderItem,
  itemSeparator,
}) => {
  const length = data.length
  return (
    <View style={style}>
      {data ? (
        <>
          {length ? (
            data.map((item, i) => (
              <View key={keyExtractor(item)}> 
                {renderItem({ item })}
                {itemSeparator && i < data.length - 1 ? (
                  <ItemSeparator />
                ) : null}
              </View>
            ))
          ) : (
            <ListEmpty text={emptyText} />
          )}
        </>
      ) : null}
    </View>
  )
}

List.defaultProps = {
  keyExtractor: item => `${item.id}`,
  emptyText: t('messages.noResults'),
}

export const FlatList = forwardRef(({
  data,
  emptyText,
  itemSeparator,
  loading,
  refreshing,
  onRefresh,
  ...props
}, ref) => {
  const theme = useTheme()
  const refreshRef = useRef(false)

  useEffect(() => {
    if (!refreshing) {
      refreshRef.refreshing = false
    }
  }, [refreshing])
  
  return (
    <$FlatList
      ref={ref}
      ItemSeparatorComponent={itemSeparator ? ItemSeparator : undefined}
      ListEmptyComponent={data && !loading ? <ListEmpty text={emptyText} /> : null}
      refreshControl={onRefresh && (
        <RefreshControl
          refreshing={refreshRef.current && refreshing}
          tintColor={theme.colors.textMuted}
          onRefresh={() => {
            refreshRef.current = true
            onRefresh()
          }} />
      )}
      data={data}
      {...props} />
  )
})

FlatList.defaultProps = {
  ...List.defaultProps,
  keyboardShouldPersistTaps: 'always'
}

export const ListEmpty = ({ text }) => {
  const styles = useStyles(themedStyles)
  return (
    <View style={styles.listEmptyContainer}>
      <Text style={styles.listEmptyText}>{text}</Text>
    </View>
  )
}

export const ItemSeparator = ({ highlighted }) => {
  const styles = useStyles(themedStyles)
  return <View style={styles.itemSeparator} />
}

const themedStyles = createThemedStyleSheet(theme => ({
  listEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl
  },
  listEmptyText: {
    color: theme.colors.textMuted
  },
  itemSeparator: {
    marginLeft: theme.spacing.l,
    height: StyleSheet.hairlineWidth,
    backgroundColor: theme.colors.borderLight
  }
}))
