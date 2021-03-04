import React, { forwardRef } from 'react'
import { NativeMethods } from 'react-native'
import { createThemedStyles, useThemedStyles } from 'lib/restyle'
import { t } from 'helpers/i18n'
import { Theme } from 'theme'
import { AutocompleteInput, AutocompleteInputProps } from './AutocompleteInput'

export const SearchInput = forwardRef<NativeMethods, AutocompleteInputProps>(({
  inputStyle,
  placeholder = t('actions.search'),
  accessibilityLabel = t('actions.search'),
  ...props
}: AutocompleteInputProps, ref: any) => {
  const styles = useThemedStyles(themedStyles)

  return (
    <AutocompleteInput
      ref={ref}
      inputStyle={[styles.input, inputStyle]}
      leftIcon="search"
      placeholder={placeholder}
      accessibilityLabel={accessibilityLabel}
      {...props} />
  )
})

const themedStyles = createThemedStyles((theme: Theme) => ({
  input: {
    height: 38,
    minHeight: 38,
    color: theme.colors.inputForegroundRegular,
    backgroundColor: theme.colors.inputBackgroundMuted,
    borderRadius: theme.borderRadii.l
  }
}))
