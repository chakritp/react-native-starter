import noop from 'lodash/noop'
import React from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { t } from 'helpers/i18n'
import { Box } from '../../common'
import { Button } from '../../Button'
import { ModalInput } from '../ModalInput'
import { DateTimePickerBaseProps } from './common'

export default function PlatformDateTimePicker({
  defaultValue,
  clearable = !defaultValue,
  value,
  open,
  onClose = noop,
  onChange = noop,
  ...props
}: DateTimePickerBaseProps) {
  return (
    <ModalInput
      visible={open}
      onClose={onClose}>
      <DateTimePicker
        value={value || defaultValue!}
        onChange={(_ev, value) => onChange(value || null)}
        {...props} />
      
      <Box flexDirection="row" justifyContent="center">
        {clearable && (
          <Button
            variant="secondary"
            mx="l"
            width={120}
            size="s"
            title={t('actions.clear')} 
            onPress={() => {
              onChange(null)
              onClose()
            }} />
        )}
        
        <Button
          mx="l"
          width={120}
          size="s"
          title={t('actions.done')} 
          onPress={() => {
            if (!value) {
              onChange(defaultValue!)
            }
            onClose()
          }} />
      </Box>
    </ModalInput>
  )
}
