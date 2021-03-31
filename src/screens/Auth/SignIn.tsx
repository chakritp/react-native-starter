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
  TextInput,
  FormProvider,
  Heading,
  useFormScreen,
  useFormErrorAlert
} from 'components/core'
import { WizardContainer, SubmitButton } from 'components/wizard'
import { scopedTranslate } from 'helpers/i18n'
import { AuthScreenProps } from 'screens/types'

interface FormValues {
  email: string
}

const schema = yup.object().shape({
  email: yup.string().email().required()
})

export const SignIn = observer(({ navigation }: AuthScreenProps<'SignIn'>) => {
  const { authStore: { email, requestCode } } = useStore()
  const t = scopedTranslate('screens.signIn')
  const agreeTerms = t('agreeTerms')

  const form = useFormScreen<FormValues>({
    name: 'signIn',
    schema,
    defaultValues: {
      email: email || ''
    },
    onSubmit: requestCode,
    onSuccess: () => navigation.navigate('Verify')
  })

  useFormErrorAlert(form, { ignoreUnauthorized: false })

  return (
    <WizardContainer>
      <Heading title={t('screens.signIn.title')} />
      <FormProvider {...form}>
        <Field
          name="email"
          label={form.translate('fields.email.label')}
          render={({ label, onChange, ...props }) => (
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
              <TextInput
                {...props}
                type="email"
                center
                autoFocus
                placeholder={label}
                returnKeyType="done"
                onChangeText={onChange}
                onSubmitEditing={form.submit} />
            </InputGroup>
          )} />

        <SubmitButton
          title={form.translate('actions.next')}
          disabled={!form.formState.isDirty} />
      </FormProvider>
    </WizardContainer>
  )
})
