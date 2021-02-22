import React, { useRef } from 'react'
import * as yup from 'yup'
import {
  ScrollContainer,
  FormProvider,
  Field,
  TextInput,
  Switch,
  useForm
} from 'components/core'
import { NativeMethods } from 'react-native'

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required()
})

const defaultValues = {
  firstName: '',
  lastName: '',
  toggle: false
}

type FormValues = typeof defaultValues

export default () => {
  const form = useForm<FormValues>({ schema, defaultValues })
  const lastNameRef = useRef<NativeMethods>(null)
  
  return (
    <ScrollContainer safe="top" padding>
      <FormProvider {...form}>
        <Field<FormValues>
          name="firstName"
          render={({ onChange, ...props }) => (
            <TextInput
              {...props}
              placeholder={form.translate('fields.firstName.label')}
              autoFocus
              returnKeyType="done"
              onChangeText={onChange}
              onSubmitEditing={() => lastNameRef.current?.focus()} />
          )} />
        
        <Field<FormValues>
          name="lastName"
          render={({ onChange, ...props }) => (
            <TextInput
              {...props}
              ref={lastNameRef}
              placeholder={form.translate('fields.lastName.label')}
              autoFocus
              returnKeyType="done"
              onChangeText={onChange} />
          )} />

        <Field<FormValues>
          name="toggle"
          render={({ onChange, ...props }) => (
            <Switch
              {...props}
              onValueChange={onChange} />
          )} />
      </FormProvider>
    </ScrollContainer>
  )
}
