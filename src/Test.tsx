import React, { useEffect } from 'react'
import { ScrollContainer } from 'components/core/layout'
import { Text, TextProps } from 'components/core/Text'
import { ThemeProvider } from '@shopify/restyle'
import SplashScreen from 'react-native-splash-screen'
import { defaultTheme } from 'theme'

const { textVariants } = defaultTheme

export const Test = () => {
  useEffect(() => {
    SplashScreen.hide()
  }, [])
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <ScrollContainer safe="top" contentPadding="xl">
        {Object.keys(textVariants).filter(k => k !== 'defaults').map((variant) => (
          <Text variant={variant as TextProps['variant']} mb="l">
            Championship teams require chemistry and trust
          </Text>
        ))}
      </ScrollContainer>
    </ThemeProvider>
  )
}
