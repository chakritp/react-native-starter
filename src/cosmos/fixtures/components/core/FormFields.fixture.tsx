import React, { useEffect, useMemo, useRef } from 'react'
import { KeyboardAvoidingView, NativeMethods } from 'react-native'
import Chance from 'chance'
import * as yup from 'yup'
import { useValue } from 'react-cosmos/fixture'
import {
  Text,
  ScrollContainer,
  FormProvider,
  Field,
  InputGroup,
  TextInput,
  FormattedTextInput,
  Switch,
  Picker,
  DateTimePicker,
  AutocompletePicker,
  LocalAutocompletePicker,
  Button,
  Toast,
  useForm
} from 'components/core'
import { useMockCollection } from 'cosmos/helpers'

const chance = new Chance(1)

const schema = yup.object().shape({
  textInput1: yup.string().min(3).max(5).required(),
  textInput2: yup.string().required(),
  formattedTextInput: yup.number().max(300000, ({ max }) => ({
    type: 'number.max', params: { max: `$${(max * 0.01).toFixed(2)}` }
  })),
  picker: yup.string().nullable().required("Gotta pick one")
})

const defaultValues = {
  textInput1: '',
  textInput2: '',
  formattedTextInput: 327450,
  picker: null,
  autocompletePicker: null,
  localAutocompletePicker: null,
  datePicker: null as Date | null,
  timePicker: null as Date | null,
  switch: false
}

type FormValues = typeof defaultValues

export default () => {
  const [disabled] = useValue('disabled', { defaultValue: false })
  
  const pickerItems = useMemo(() => (
    new Array(10).fill(0).map((_, i) => ({ label: chance.name(), value: i + 1 }))
  ), [])

  const mockCollection = useMockCollection()

  const form = useForm<FormValues>({
    schema,
    defaultValues: { ...defaultValues, timePicker: new Date() },
    onSubmit: async (values: FormValues) => {
      await new Promise(r => setTimeout(r, 500))
      console.log(values)
    },
    onSuccess: () => Toast.success("You did it!")
  })
  const lastNameRef = useRef<NativeMethods>(null)

  useEffect(() => {
    form.setError('textInput2', { message: 'Error message' })
  }, [])

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScrollContainer safe="top" contentPadding="xl" contentPaddingBottom="xxl" keyboardShouldPersistTaps="handled">
        <FormProvider {...form}>
          <Field<FormValues>
            name="textInput1"
            label="TextInput"
            render={({ label, onChange, ...props }) => (
              <InputGroup label={label} info="Info">
                <TextInput
                  {...props}
                  leftIcon="lightbulb"
                  placeholder="Placeholder"
                  autoFocus
                  returnKeyType="done"
                  disabled={disabled}
                  onChangeText={onChange}
                  onSubmitEditing={() => lastNameRef.current?.focus()} />
              </InputGroup>
            )} />
          
          <Field<FormValues>
            name="textInput2"
            label="TextInput (with error)"
            render={({ label, onChange, ...props }) => (
              <InputGroup label={label}>
                <TextInput
                  {...props}
                  type="password"
                  ref={lastNameRef}
                  disabled={disabled}
                  onChangeText={onChange} />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="formattedTextInput"
            label="FormattedTextInput"
            render={({ label, onChange, ...props }) => (
              <InputGroup label={label}>
                <FormattedTextInput<number>
                  {...props}
                  format={value => `$${(value * 0.01).toFixed(2)}`}
                  parse={text => parseInt(text.replace(/\D/g, '') || '0', 10)}
                  disabled={disabled}
                  onChangeValue={onChange} />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="picker"
            label="Picker"
            render={({ label, onChange, ...props }) => (
              <InputGroup label={label}>
                <Picker
                  {...props}
                  items={pickerItems}
                  placeholder="Select Option"
                  disabled={disabled}
                  onChange={onChange} />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="autocompletePicker"
            label="AutocompletePicker"
            render={({ label, ...props }) => (
              <InputGroup label={label}>
                <AutocompletePicker
                  {...props}
                  placeholder="Choose location"
                  clearable
                  loading={mockCollection.loading}
                  itemLabelExtractor={item => item.name}
                  itemPropsExtractor={item => ({ title: item.name, subtitle: item.description })}
                  items={mockCollection.items}
                  disabled={disabled}
                  onOpen={() => !mockCollection.items && mockCollection.reset()}
                  onLoad={mockCollection.load}
                  onLoadMore={mockCollection.loadMore} />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="localAutocompletePicker"
            label="LocalAutocompletePicker"
            render={({ label, ...props }) => (
              <InputGroup label={label}>
                <LocalAutocompletePicker
                  {...props}
                  placeholder="Choose location"
                  clearable
                  itemLabelExtractor={item => item.name}
                  items={mockCollection.allItems}
                  disabled={disabled} />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="datePicker"
            label="DateTimePicker (date)"
            render={({ label, ...props }) => (
              <InputGroup label={label}>
                <DateTimePicker
                  {...props}
                  clearable
                  format="MM/DD/Y"
                  placeholder="--/--/----"
                  disabled={disabled} />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="timePicker"
            label="DateTimePicker (time)"
            render={({ label, ...props }) => (
              <InputGroup label={label}>
                <DateTimePicker
                  {...props}
                  mode="time"
                  disabled={disabled}
                  format="hh:mm A"
                  placeholder="--:--" />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="switch"
            label="Switch"
            render={({ label, onChange, ...props }) => (
              <InputGroup label={label} inline={{ justifyContent: 'flex-end' }}>
                <Switch
                  {...props}
                  disabled={disabled}
                  onValueChange={onChange} />
              </InputGroup>
            )} />

          <InputGroup inline label="Inline Group">
            <TextInput leftIcon="date-range" disabled={disabled} />
            <Text variant="s2">{'  /  '}</Text>
            <TextInput leftIcon="date-range" disabled={disabled} />
          </InputGroup>

          <Button
            title="Submit"
            disabled={!form.formState.isDirty}
            loading={form.formState.isSubmitting}
            onPress={form.submit} />
        </FormProvider>
      </ScrollContainer>
    </KeyboardAvoidingView>
  )
}
