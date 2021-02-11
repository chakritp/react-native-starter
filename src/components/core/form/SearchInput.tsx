import React, { forwardRef } from 'react'
import { createThemedStyleSheet, useStyles } from 'theme'
import { t } from 'helpers/i18n'
import { AutocompleteInput } from './AutocompleteInput'

export const SearchInput = forwardRef(({
  inputStyle,
  placeholder = t('actions.search'),
  ...props
}, ref) => {
  const styles = useStyles(themedStyles)

  return (
    <AutocompleteInput
      ref={ref}
      inputStyle={[styles.input, inputStyle]}
      leftIcon="search"
      placeholder={placeholder}
      {...props} />
  )
})

const themedStyles = createThemedStyleSheet(theme => ({
  input: {
    height: 38,
    minHeight: 38,
    color: theme.colors.text,
    backgroundColor: theme.colors.searchInputBg,
    borderRadius: theme.radii.l
  }
}))
