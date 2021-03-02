import React from 'react'
import * as yup from 'yup'
import { observer } from 'mobx-react-lite'
import { useStore } from 'lib/mst'
import {
  Field,
  InputGroup,
  FormProvider,
  Heading,
  useFormScreen,
  useFormErrorAlert
} from 'components/core'
import { WizardContainer, SubmitButton, SecondaryButton } from 'components/wizard'
import { USPhoneNumberInput } from 'components/USPhoneNumberInput'
import { scopedTranslate } from 'helpers/i18n'
import { AuthScreenProps } from 'screens/types'

interface FormValues {
  phoneNumber: string
}

const schema = yup.object().shape({
  phoneNumber: yup.string().required().min(10)
})

export const SignIn = observer(({ navigation, route }: AuthScreenProps<'SignIn'>) => {
  const { defaultValues = {} } = route.params || {}
  const { authStore: { phoneNumber, requestCode } } = useStore()
  const t = scopedTranslate('screens.signIn')

  if (!defaultValues.phoneNumber && phoneNumber) {
    defaultValues.phoneNumber = phoneNumber
  }

  const form = useFormScreen<FormValues>({
    name: 'signIn',
    schema,
    defaultValues: {
      phoneNumber: '',
      ...defaultValues
    },
    onSubmit: requestCode,
    onSuccess: () => navigation.navigate('VerifyCode')
  })

  useFormErrorAlert(form, { ignoreUnauthorized: false })

  return (
    <WizardContainer>
      <Heading title={t('screens.signIn.title')} />
      <FormProvider {...form}>
        <Field
          name="phoneNumber"
          render={({ onChange, ...props }) => (
            <InputGroup>
              <USPhoneNumberInput
                {...props}
                center
                autoFocus={!defaultValues.phoneNumber}
                placeholder={form.translate('fields.phoneNumber.label')}
                returnKeyType="done"
                onChangeValue={onChange}
                onSubmitEditing={form.submit} />
            </InputGroup>
          )} />

        <SubmitButton
          title={form.translate('actions.getCode')}
          form={form} />

        <SecondaryButton
          title={form.translate('noAccount')}
          disabled={form.formState.isSubmitting}
          onPress={() => navigation.replace('SignUp', { defaultValues: form.getValues() })} />
      </FormProvider>
    </WizardContainer>
  )
})
