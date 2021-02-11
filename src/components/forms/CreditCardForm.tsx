import moment from 'moment'
import React, { useMemo } from 'react'
import * as yup from 'yup'
import {
  Text,
  Field,
  InputGroup,
  FormProvider,
  FormattedTextInput,
  Picker,
  useFormScreen
} from 'components/core'
import { formatCreditCardNumber } from 'helpers/formatters'

const schema = yup.object().shape({
  number: yup.string().min(16).required(),
  expirationMonth: yup.string().required(),
  expirationYear: yup.string().required()
})

export const CreditCardForm = ({ inputStyle, formHook = useFormScreen, children, ...formProps }) => {
  const form = formHook({
    name: 'creditCard',
    schema,
    ...formProps
  })

  const expirationMonthItems = useMemo(() => {
    return new Array(12).fill(0).map((_, i) => {
      const value = i < 9 ? `0${i + 1}` : `${i + 1}`
      return {
        value,
        label: value
      }
    })
  }, [])

  const expirationYearItems = useMemo(() => {
    const currentMoment = moment().startOf('year').subtract(1, 'year')
    return new Array(10).fill(0).map(() => {
      currentMoment.add(1, 'year')
      const year = currentMoment.format('Y')
      return { value: year, label: year }
    })
  }, [])

  return (  
    <FormProvider {...form}>
      <Field
        name="number"
        defaultValue=""
        render={props => (
          <InputGroup>
            <FormattedTextInput
              {...props}
              inputStyle={inputStyle}
              autoFocus
              label={form.translate('fields.number.label')}
              placeholder={form.translate('fields.number.placeholder')}
              format={formatCreditCardNumber}
              parse={parseCreditCardNumber}
              maxLength={19}
              keyboardType="phone-pad"
              autoCompleteType="cc-number"
              returnKeyType="done" />
          </InputGroup>
        )} />

      <InputGroup
        horizontal
        label={form.translate('fields.expiration.label')}>
        <Field
          name="expirationMonth"
          defaultValue=""
          render={props => (
            <Picker
              {...props}
              style={{ width: 90 }}
              inputStyle={inputStyle}
              placeholder={form.translate('fields.expiration.month.placeholder')}
              prompt={form.translate('fields.expiration.month.prompt')}
              items={expirationMonthItems} />
          )} />

        <Text size="l" color="textMuted">{' / '}</Text>

        <Field
          name="expirationYear"
          defaultValue=""
          render={props => (   
            <Picker
              {...props}
              style={{ width: 110 }}
              inputStyle={inputStyle}
              placeholder={form.translate('fields.expiration.year.placeholder')}
              prompt={form.translate('fields.expiration.year.prompt')}
              items={expirationYearItems} />
          )} />
      </InputGroup>

      {children && children(form)}
    </FormProvider>
  )
}

const parseCreditCardNumber = text => {
  return text.replace(/\D/g, '')
}
