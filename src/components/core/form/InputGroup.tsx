import React, { isValidElement, ReactNode } from 'react'
import { StyleProp, TextStyle, ViewStyle } from 'react-native'
import { useTheme } from '@shopify/restyle'
import { Theme } from 'theme'
import { Box, BoxProps } from '../common'
import { Text } from '../Text'
import { Label } from './Label'

export interface InputGroupProps extends BoxProps {
  labelStyle?: StyleProp<ViewStyle>
  labelTextStyle?: StyleProp<TextStyle>
  infoStyle?: StyleProp<ViewStyle>
  infoTextStyle?: StyleProp<TextStyle>
  inline?: boolean | BoxProps
  infoPlacement?: 'left' | 'center' | 'right'
  label?: string | ReactNode
  info?: string | ReactNode
}

export const InputGroup = ({
  labelStyle,
  infoStyle,
  infoTextStyle,
  inline,
  infoPlacement = 'right',
  label,
  info,
  children,
  ...props
}: InputGroupProps) => {
  const theme = useTheme<Theme>()
  const infoAlign = infoPlacement === 'center' ? 'center' : infoPlacement === 'right' ? 'flex-end' : 'flex-start'

  const labelElement = label !== undefined && (
    isValidElement(label) ? label : (
      <Label style={labelStyle} inline={!!inline}>{label}</Label>
    )
  )

  return (
    <Box {...props}>
      {inline ? (
        <Box flexDirection="row" alignItems="center">
          {labelElement}
          {inline !== true ? (
            <Box
              flex={1}
              flexDirection="row"
              alignItems="center"
              {...(inline !== true ? inline : undefined)}
            >
              {children}
            </Box>
          ) : children}
        </Box>
      ) : (
        <>
          {labelElement}
          {children}
        </>
      )}
      
      <Box minHeight={theme.spacing.l} pb="xs" alignItems={infoAlign}>
        {info !== undefined && (
          <Box
            style={infoStyle}
            flexDirection="row"
            alignItems="center"
            minHeight={theme.spacing.l}
            paddingTop="xs"
            paddingBottom="s"
          >
            {isValidElement(info) ? info : (
              <Text
                style={infoTextStyle}
                variant="c2"
                font="bodyRegular"
                color="mainForegroundMuted"
              >
                {info}
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}
