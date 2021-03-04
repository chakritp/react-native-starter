import React from 'react'
import { Linking } from 'react-native'
import * as yup from 'yup'
import { observer } from 'mobx-react-lite'
import { useStore } from 'lib/mst'
import { TERMS_OF_SERVICE_URL, PRIVACY_POLICY_URL } from 'config'
import {
  Text,
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
  phoneNumber: yup.string().min(10)
})

export const SignUp = observer(({ route, navigation }: AuthScreenProps<'SignUp'>) => {
  const { params } = route
  const { authStore: { signUp } } = useStore()
  const t = scopedTranslate('screens.signUp')

  const form = useFormScreen<FormValues>({
    name: 'signUp',
    schema,
    defaultValues: {
      phoneNumber: '',
      ...params?.defaultValues
    },
    onSubmit: signUp,
    onSuccess: () => navigation.navigate('VerifyCode')
  })

  useFormErrorAlert(form, { ignoreUnauthorized: false })

  const agreeTerms = t('agreeTerms')

  return (
    <WizardContainer>
      <Heading title={t('title')} />
      <FormProvider {...form}>
        <Field<FormValues>
          name="phoneNumber"
          label={form.translate('fields.phoneNumber.label')}
          render={({ label: _, onChange, ...props }) => (
            <InputGroup
              info={
                <Text variant="c2" color="mainForegroundMuted" textAlign="center" lineHeight={20}>
                  {agreeTerms[0]}
                  <Text font="bodyBold" onPress={() => Linking.openURL(TERMS_OF_SERVICE_URL)}>
                    {agreeTerms[1]}
                  </Text>
                  {agreeTerms[2]}
                  <Text font="bodyBold" onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
                    {agreeTerms[3]}
                  </Text>
                </Text>
              }
              infoPlacement="center"
            >
              <USPhoneNumberInput
                {...props}
                center
                autoFocus
                placeholder={form.translate('fields.phoneNumber.placeholder')}
                returnKeyType="done"
                onChangeValue={onChange}
                onSubmitEditing={form.submit} />
            </InputGroup>
          )} />

        <SubmitButton
          title={form.translate('actions.createAccount')}
          form={form} />

        <SecondaryButton
          title={form.translate('hasAccount')}
          disabled={form.formState.isSubmitting}
          onPress={() => navigation.replace('SignIn', { defaultValues: form.getValues() })} />
      </FormProvider>
    </WizardContainer>
  )
})
