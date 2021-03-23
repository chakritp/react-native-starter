import React, { forwardRef, useMemo } from 'react'
import { View, Text, TextInput, TextInputProps, NativeMethods } from 'react-native'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { Theme } from 'theme'
import { Box } from '../common'

const FONT_SIZE = 48

export interface CodeInputProps extends TextInputProps {
  length: number
  hasError?: boolean
}

export const CodeInput = forwardRef<NativeMethods, CodeInputProps>((props: CodeInputProps, ref: any) => {
  const { length, value, hasError, ...inputProps } = props
  const styles = useThemedStyles(themedStyles)
  const charTextStyle = useMemo(() => [styles.charText, hasError && styles.charTextError], [hasError])

  return (
    <Box width={length * FONT_SIZE}>
      <Box flexDirection="row" justifyContent="space-between" width="100%">
        {new Array(length).fill(0).map((_, i) => (
          <View key={`${i}`} style={[styles.charContainer]}>
            <Text style={charTextStyle} allowFontScaling={false}>
              {value?.charAt(i) || ' '}
            </Text>
          </View>
        ))}
      </Box>
      <TextInput
        ref={ref}
        style={styles.input}
        maxLength={length}
        keyboardType="number-pad"
        allowFontScaling={false}
        value={value}
        {...inputProps}
      />
    </Box>
  )
})

const themedStyles = createThemedStyles((theme: Theme) => ({
  input: {
    position: 'absolute',
    padding: 0,
    width: '100%',
    fontSize: FONT_SIZE,
    fontVariant: ['tabular-nums'],
    letterSpacing: 21,
    opacity: 0
  },
  charContainer: {
    width: 36,
    borderBottomColor: theme.colors.inputBorderRegular,
    borderBottomWidth: 2
  },
  charText: {
    ...theme.fonts.bodyRegular,
    fontSize: FONT_SIZE,
    lineHeight: FONT_SIZE * 1.1,
    textAlign: 'center'
  },
  charTextError: {
    color: theme.colors.dangerRegular
  }
}))
