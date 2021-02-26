import React from 'react'
import { StyleSheet, StyleProp, TextStyle } from 'react-native'
import { Box, BoxProps } from './common'
import { Text } from './Text'

export interface ListSectionProps extends BoxProps {
  titleStyle?: StyleProp<TextStyle>
  title?: string
  topSpacing?: boolean
  bottomSpacing?: boolean
}

export const ListSection = ({
  title,
  titleStyle,
  topSpacing,
  bottomSpacing,
  children,
  ...containerProps
} : ListSectionProps) => {
  return (
    <Box 
      mt={topSpacing ? 'l' : undefined}
      mb={bottomSpacing ? 'l' : undefined}
      {...containerProps}
    >
      {title && (
        <Text
          variant="p4"
          mt="l"
          mb="xs"
          ml="l"
          color="mainForegroundMuted"
          textTransform="uppercase"
          style={titleStyle}
        >
          {title}
        </Text>
      )}
      <Box
        borderTopWidth={StyleSheet.hairlineWidth}
        borderBottomWidth={StyleSheet.hairlineWidth}
        borderColor="mainBorderMuted"
      >
        {children}
      </Box>
    </Box>
  )
}
