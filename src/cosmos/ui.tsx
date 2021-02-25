import React from 'react'
import { Box, BoxProps, Text, TextProps } from 'components/core'

export const IMAGE_URI_1 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5O97UmEt73MwLcpjFeoteuDitpLc2RFVARw8jJJ2FI9HkyXgh&s'
export const IMAGE_URI_2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgCvlJ0VhLBYzrNdLTaPc3JEYQjuczU45c6ih2hXf32z0iyzsmSQ&s'

export const Label = (props: TextProps) => (
  <Text
    variant="c2"
    font="bodyRegular"
    marginVertical="s"
    color="mainForegroundMuted"
    {...props} />
)

export const Section = ({ label, children, ...props }: { label?: string } & BoxProps) => (
  <Box {...props}>
    {label && <Label>{label}</Label>}
    {children}
  </Box>
)
