import React, { useEffect, useMemo, useRef, useState } from 'react'
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
  useForm
} from 'components/core'

const chance = new Chance(1)

const schema = yup.object().shape({
  textInput1: yup.string().required(),
  textInput2: yup.string().required()
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
interface AutocompleteItem {
  id: number
  name: string
  description: string
}

interface AutocompleteState {
  loading: boolean
  page: number
  items: AutocompleteItem[]
}

export default () => {
  const [disabled] = useValue('disabled', { defaultValue: false })
  const pickerItems = useMemo(() => (
    new Array(10).fill(0).map((_, i) => ({ label: chance.name(), value: i + 1 }))
  ), [])
  const autocompletePickerItems = useMemo(() => (
    new Array(50).fill(0).map((_, i) => ({ id: i + 1, name: chance.city(), description: chance.sentence() }))
  ), [])

  let [autocompleteState, setAutocompleteState] = useState<AutocompleteState>({ loading: false, page: 1, items: [] })

  const resetAutocompleteItems = () => {
    autocompleteState = { loading: false, page: 1, items: [] }
    setAutocompleteState(autocompleteState)
    loadAutocompleteItems('')
  }

  const loadAutocompleteItems = (query: string, page = 1) => {
    const queryLc = query.toLowerCase()
    autocompleteState = { ...autocompleteState, loading: true }
    setAutocompleteState(autocompleteState)
    setTimeout(() => {
      const newItems = query
        ? autocompletePickerItems.filter(item => item.name.toLowerCase().indexOf(queryLc) > -1)
        : autocompletePickerItems
      autocompleteState = { loading: false, items: newItems.slice(0, page * 20), page }
      setAutocompleteState(autocompleteState)
    }, 300)
  }

  const loadMoreAutocompleteItems = (query: string) => {
    loadAutocompleteItems(query, autocompleteState.page + 1)
  }

  const form = useForm<FormValues>({
    schema,
    defaultValues: { ...defaultValues, timePicker: new Date() },
    onSubmit: async (values: FormValues) => {
      await new Promise(r => setTimeout(r, 500))
      console.log(values)
    }
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
            render={({ onChange, ...props }) => (
              <InputGroup label="TextInput" info="Info">
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
            render={({ onChange, ...props }) => (
              <InputGroup label="TextInput (with error)">
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
            render={({ onChange, ...props }) => (
              <InputGroup label="FormattedTextInput">
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
            render={({ onChange, ...props }) => (
              <InputGroup label="Picker">
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
            render={props => (
              <InputGroup label="AutocompletePicker">
                <AutocompletePicker<AutocompleteItem, number>
                  {...props}
                  placeholder="Search"
                  clearable
                  loading={autocompleteState.loading}
                  itemLabelExtractor={item => item.name}
                  itemPropsExtractor={item => ({ title: item.name, subtitle: item.description })}
                  items={autocompleteState.items}
                  disabled={disabled}
                  onOpen={() => !autocompleteState.items && resetAutocompleteItems()}
                  onLoad={loadAutocompleteItems}
                  onLoadMore={loadMoreAutocompleteItems} />
              </InputGroup>
            )} />

          <Field<FormValues>
            name="localAutocompletePicker"
            render={props => (
              <InputGroup label="LocalAutocompletePicker">
                <LocalAutocompletePicker
                  {...props}
                  placeholder="Search"
                  clearable
                  loading={autocompleteState.loading}
                  itemLabelExtractor={item => item.name}
                  disabled={disabled}
                  items={autocompletePickerItems}/>
              </InputGroup>
            )} />

          <Field<FormValues>
            name="datePicker"
            render={props => (
              <InputGroup label="DateTimePicker (date)">
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
            render={props => (
              <InputGroup label="DateTimePicker (time)">
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
            render={({ onChange, ...props }) => (
              <InputGroup inline={{ justifyContent: 'flex-end' }} label="Switch">
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
