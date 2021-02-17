import React from 'react'
import { ImageProps, View } from 'react-native'
import { IMAGE_URI_1, IMAGE_URI_2 } from 'cosmos/ui'
import { Avatar, ScrollContainer } from 'components/core'

export default () => {
  return (
    <ScrollContainer safe="top">
      <Row icon="person-outline" />
      <Row icon="person-outline" rounded />
      <Row source={{ uri: IMAGE_URI_2 }} />
      <Row source={{ uri: IMAGE_URI_1 }} rounded />
    </ScrollContainer>
  )
}

const Row = (props: { icon?: string, source?: ImageProps['source'], rounded?: boolean }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', margin: 8 }}>
    <Avatar size="s" {...props} />
    <Avatar size="m" {...props} />
    <Avatar size="l" {...props} />
    <Avatar size="xl" {...props} />
  </View>
)
