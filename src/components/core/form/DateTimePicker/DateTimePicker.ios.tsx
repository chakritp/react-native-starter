import React from 'react'
import { View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { createThemedStyleSheet, useStyles } from 'theme'
import { Button } from 'components/core'
import { ModalInput } from '../common'
import { t } from 'helpers/i18n'

export const PlatformDateTimePicker = ({
  defaultValue,
  value,
  open,
  close,
  onChange,
  ...props
}) => {
  const styles = useStyles(themedStyles)

  return (
    <ModalInput
      visible={open}
      onClose={close}>
      <DateTimePicker
        value={value || defaultValue}
        onChange={(_ev, value) => onChange(value)}
        {...props} />
      
      <View style={styles.footer}>
        <Button
          style={styles.footerButton}
          variant="secondary"
          size="s"
          title={t('actions.clear')} 
          onPress={() => {
            onChange(null)
            close()
          }} />

        <Button
          style={styles.footerButton}
          size="s"
          title={t('actions.done')} 
          onPress={() => {
            if (!value) {
              onChange(defaultValue)
            }
            close()
          }} />
      </View>
    </ModalInput>
  )
}

const themedStyles = createThemedStyleSheet(theme => ({
  footer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  footerButton: {
    width: 120,
    marginHorizontal: theme.spacing.l
  }
}))
