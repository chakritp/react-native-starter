import React, { useEffect } from 'react'
import * as yup from 'yup'
import { observer } from 'mobx-react-lite'
import { ApiServerError } from 'lib/api'
import { useStore } from 'lib/mst'
import {
  Text,
  Field,
  InputGroup,
  TextInput,
  FormProvider,
  useFormScreen,
  useFormErrorAlert,
  useErrorAlert,
  Heading
} from 'components/core'
import { WizardContainer, SecondaryButton } from 'components/wizard'
import { scopedTranslate } from 'helpers/i18n'
import { AuthScreenProps } from 'screens/types'

const CODE_LENGTH = 6

const schema = yup.object().shape({
  code: yup.string().min(CODE_LENGTH)
})

export const Verify = observer(({ route }: AuthScreenProps<'Verify'>) => {
  const { params } = route
  const { authStore: { email, requestCode, requestCodeTask, signIn } } = useStore()
  const t = scopedTranslate('screens.verify')

  const form = useFormScreen({
    name: 'verify',
    schema,
    defaultValues: {
      code: params?.code || ''
    },
    onSubmit: signIn
  })

  useFormErrorAlert(form, {
    ignoreUnauthorized: false,
    onError: error => {
      if (error instanceof ApiServerError && error.code === 'unauthorized') {
        return t('messages.api.common.verfication_code_invalid')
      }
    }
  })

  useErrorAlert(requestCodeTask)

  useEffect(() => {
    if (params?.code) {
      form.submit()
    }
  }, [])

  const subtitle = t('subtitle')

  return (
    <WizardContainer>
      <Heading title={t('title')}>
        <Text variant="s1" numberOfLines={1} mt="s">{email}</Text>
        <Text variant="s3" textAlign="center" mt="l" lineHeight={24}>
          <>
            <Text>{subtitle[0]}</Text>
            <Text font="bodyBold">{subtitle[1]}</Text>
            <Text>{subtitle[2]}</Text>
          </>
        </Text>
      </Heading>
      <FormProvider {...form}>
        <Field
          name="code"
          label={form.translate('fields.code.label')}
          render={({ label, onChange, ...props }) => (
            <InputGroup>
              <TextInput
                {...props}
                center
                placeholder={form.translate('fields.code.placeholder')}
                accessibilityLabel={label}
                autoFocus
                maxLength={CODE_LENGTH}
                keyboardType="number-pad"
                onChangeText={value => {
                  onChange(value)
                  if (value.length === CODE_LENGTH) {
                    form.submit()
                  }
                }} />
            </InputGroup>
          )} />

        <SecondaryButton
          title={form.translate('actions.resendEmail')}
          disabled={form.formState.isSubmitting}
          loading={requestCodeTask.pending}
          onPress={() => {
            form.setValue('code', '')
            requestCode()
          }} />
      </FormProvider>
    </WizardContainer>
  )
})
