import React from 'react'
import { Box, ScrollContainer, Text, TextProps } from 'components/core'
import { defaultTheme } from 'theme'

const { textVariants } = defaultTheme

export default () => {
  return (
    <ScrollContainer safe="top" contentPadding="xl">
      {Object.keys(textVariants).filter(k => k !== 'defaults').map((variant) => (
        <Box key={variant} flexDirection="row" mb="xl">
          <Box width={40}>
            <Text variant="h3">{variant}</Text>
          </Box>
          <Text variant={variant as TextProps['variant']} flex={1}>
            Yeah, well, you know, that’s just, like, your opinion.
          </Text>
        </Box>
      ))}
    </ScrollContainer>
  )
}
