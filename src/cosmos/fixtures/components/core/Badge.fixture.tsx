import React from 'react'
import { useValue } from 'react-cosmos/fixture'
import { Box, ScrollContainer, Badge } from 'components/core'
import { Theme } from 'theme'

export default () => {
  const [text] = useValue('text', { defaultValue: '1024' })

  return (
    <ScrollContainer safe="top">
      <Row color="dangerHeavy" />
      <Row color="infoRegular" text={text} />
      <Row color="successRegular" text={text} />
      <Row color="attentionRegular" text={text} />
      <Row color="warningRegular" text={text} />
      <Row color="dangerRegular" text={text} />
    </ScrollContainer>
  )
}

const Row = ({ text, ...props }: { text?: string, color: keyof Theme['colors'] }) => {
  return (
    <Box flexDirection="row" flexWrap="wrap" alignItems="center" justifyContent="space-evenly" margin="m">
      <Badge size="xxs" {...props}>{text}</Badge>
      <Badge size="xs" {...props}>{text}</Badge>
      <Badge size="s" {...props}>{text}</Badge>
      <Badge size="m" {...props}>{text}</Badge>
      <Badge size="l" {...props}>{text}</Badge>
    </Box>
  )
}
