import React, { Ref, ReactElement, forwardRef, useEffect, useRef } from 'react'
import {
  View,
  FlatList as $FlatList,
  RefreshControl,
  StyleSheet,
  StyleProp,
  ViewStyle,
  FlatListProps as $FlatListProps
} from 'react-native'
import { t } from 'helpers/i18n'
import { createThemedStyleSheet, useStyles, useTheme } from 'theme'
import { Text } from './Text'

const defaultKeyExtractor = (item: any) => `${item.id}`

export interface ListProps<T> {
  style?: StyleProp<ViewStyle>
  data?: T[]
  emptyText?: string
  keyExtractor?: (item: T) => string | undefined,
  renderItem: ({ item }: { item: T }) => ReactElement | null,
  itemSeparator?: boolean
}

export const List = <T, >({
  style,
  data,
  emptyText,
  keyExtractor = defaultKeyExtractor,
  renderItem,
  itemSeparator,
}: ListProps<T>) => {
  const length = data?.length
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
            <ListEmpty text={emptyText || t('messages.noResults')} />
          )}
        </>
      ) : null}
    </View>
  )
}

export interface FlatListProps<T> extends $FlatListProps<T> {
  emptyText?: string
  itemSeparator?: boolean
  loading?: boolean
}

export const FlatList = forwardRef(<T, >(props: FlatListProps<T>, ref: any) => {
  const {
    data,
    emptyText,
    itemSeparator,
    loading,
    refreshing,
    onRefresh,
    ...listProps
  } = props

  const theme = useTheme()
  const refreshRef = useRef(false)

  useEffect(() => {
    if (!refreshing) {
      refreshRef.current = false
    }
  }, [refreshing])
  
  return (
    <$FlatList
      ref={ref}
      keyboardShouldPersistTaps="always"
      ItemSeparatorComponent={itemSeparator ? ItemSeparator : undefined}
      ListEmptyComponent={data && !loading ? <ListEmpty text={emptyText || t('messages.noResults')} /> : null}
      refreshControl={onRefresh ? (
        <RefreshControl
          refreshing={refreshRef.current && !!refreshing}
          tintColor={theme.colors.textMuted}
          onRefresh={() => {
            refreshRef.current = true
            onRefresh()
          }} />
      ) : undefined}
      data={data}
      {...listProps} />
  )
}) as <T>(p: FlatListProps<T> & { ref?: Ref<$FlatList> }) => ReactElement

export type FlatListElement = $FlatList

export const ListEmpty = ({ text }: { text: string }) => {
  const styles = useStyles(themedStyles)
  return (
    <View style={styles.listEmptyContainer}>
      <Text style={styles.listEmptyText}>{text}</Text>
    </View>
  )
}

export const ItemSeparator = () => {
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
