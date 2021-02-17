import React from 'react'
import { View } from 'react-native'
import { useValue } from 'react-cosmos/fixture'
import { ScrollContainer, Badge } from 'components/core'

export default () => {
  const [text] = useValue('text', { defaultValue: '1024' })

  return (
    <ScrollContainer safe="top">
      <Row color="danger" />
      <Row color="info" text={text} />
      <Row color="success" text={text} />
      <Row color="attention" text={text} />
      <Row color="warning" text={text} />
      <Row color="danger" text={text} />
    </ScrollContainer>
  )
}

const Row = ({ text, ...props }: { text?: string, color: string }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-evenly', margin: 8 }}>
      <Badge size="xxs" {...props}>{text}</Badge>
      <Badge size="xs" {...props}>{text}</Badge>
      <Badge size="s" {...props}>{text}</Badge>
      <Badge size="m" {...props}>{text}</Badge>
      <Badge size="l" {...props}>{text}</Badge>
    </View>
  )
}
