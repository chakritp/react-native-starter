import noop from 'lodash/noop'
import React from 'react'
import { View } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { createThemedStyleSheet, useStyles } from 'theme'
import { t } from 'helpers/i18n'
import { Button } from '../../Button'
import { ModalInput } from '../ModalInput'
import { DateTimePickerBaseProps } from './common'

export default function PlatformDateTimePicker({
  defaultValue,
  value,
  open,
  onClose = noop,
  onChange = noop,
  ...props
}: DateTimePickerBaseProps) {
  const styles = useStyles(themedStyles)

  return (
    <ModalInput
      visible={open}
      onClose={onClose}>
      <DateTimePicker
        value={value || defaultValue!}
        onChange={(_ev, value) => onChange(value || null)}
        {...props} />
      
      <View style={styles.footer}>
        <Button
          style={styles.footerButton}
          variant="secondary"
          size="s"
          title={t('actions.clear')} 
          onPress={() => {
            onChange(null)
            onClose()
          }} />

        <Button
          style={styles.footerButton}
          size="s"
          title={t('actions.done')} 
          onPress={() => {
            if (!value) {
              onChange(defaultValue!)
            }
            onClose()
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
