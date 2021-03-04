import React from 'react'
import * as yup from 'yup'
import { observer } from 'mobx-react-lite'
import { ApiServerError } from 'lib/api'
import { useStore } from 'lib/mst'
import {
  Field,
  InputGroup,
  TextInput,
  FormProvider,
  useFormScreen,
  useFormErrorAlert,
  useErrorAlert,
  Heading
} from 'components/core'
import { WizardContainer, SubmitButton, SecondaryButton } from 'components/wizard'
import { t } from 'helpers/i18n'

const CODE_LENGTH = 6

const schema = yup.object().shape({
  code: yup.string().min(CODE_LENGTH)
})

export const VerifyCode = observer(() => {
  const { authStore: { requestCode, requestCodeTask, signIn } } = useStore()

  const form = useFormScreen({
    name: 'verifyCode',
    schema,
    defaultValues: {
      code: ''
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

  return (
    <WizardContainer>
      <Heading title={t('screens.verifyCode.title')} />
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
          title={form.translate('actions.sendNewCode')}
          disabled={form.formState.isSubmitting}
          loading={requestCodeTask.pending}
          onPress={() => {
            form.setValue('code', '')
            requestCode()
          }} />

        <SubmitButton
          style={{ marginTop: 40 }}
          form={form}
          title={form.translate('actions.verifyCode')} />
      </FormProvider>
    </WizardContainer>
  )
})
