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
import { useTheme } from '@shopify/restyle'
import { t } from 'helpers/i18n'
import { Theme, ThemeColor } from 'theme'
import { Box } from './common'
import { Text } from './Text'

const defaultKeyExtractor = (item: any) => `${item.id}`

export interface ListProps<T> {
  style?: StyleProp<ViewStyle>
  data?: T[]
  emptyText?: string
  keyExtractor?: (item: T) => string | undefined
  renderItem: ({ item }: { item: T }) => ReactElement | null
  itemSeparator?: boolean
}

export const List = <T, >({
  style,
  data,
  emptyText,
  keyExtractor = defaultKeyExtractor,
  renderItem,
  itemSeparator
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
  refreshControlColor?: ThemeColor
  emptyText?: string
  itemSeparator?: boolean
  loading?: boolean
}

export const FlatList = forwardRef(<T, >(props: FlatListProps<T>, ref: any) => {
  const {
    refreshControlColor = 'mainForegroundMuted',
    data,
    emptyText,
    itemSeparator,
    loading,
    refreshing,
    onRefresh,
    ...listProps
  } = props

  const theme = useTheme<Theme>()
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
          tintColor={theme.colors[refreshControlColor]}
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
  return (
    <Box 
      flex={1}
      alignItems="center"
      justifyContent="center"
      padding="xxl"
    >
      <Text variant="s2" color="mainForegroundMuted">{text}</Text>
    </Box>
  )
}

export const ItemSeparator = () => {
  return <Box ml="l" height={StyleSheet.hairlineWidth} bg="mainBorderMuted" />
}
