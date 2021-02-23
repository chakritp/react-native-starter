import React, { useEffect, useRef, useState } from 'react'
import { NativeMethods } from 'react-native'
import * as yup from 'yup'
import { useValue } from 'react-cosmos/fixture'
import {
  ScrollContainer,
  FormProvider,
  Field,
  InputGroup,
  TextInput,
  Switch,
  Picker,
  AutocompletePicker,
  LocalAutocompletePicker,
  useForm,
} from 'components/core'

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required()
})

const defaultValues = {
  textInput1: '',
  textInput2: '',
  picker: null,
  autocompletePicker: null,
  localAutocompletePicker: null,
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
  offset: number
  items: AutocompleteItem[]
}

const pickerItems = new Array(10).fill(1).map((n, i) => ({ label: `Option ${i + 1}`, value: i + 1 }))
const defaultAutocompleteState: AutocompleteState = { loading: false, offset: 0, items: [] }

export default () => {
  const [disabled] = useValue('disabled', { defaultValue: false })
  let [autocompleteState, setAutocompleteState] = useState(defaultAutocompleteState)

  const resetAutocompleteItems = () => {
    autocompleteState = defaultAutocompleteState
    setAutocompleteState(defaultAutocompleteState)
    loadAutocompleteItems('')
  }

  const loadAutocompleteItems = (query: string, offset = 0) => {
    autocompleteState = { ...autocompleteState, loading: true }
    setAutocompleteState(autocompleteState)
    setTimeout(() => {
      let { items } = autocompleteState
      const newItems = new Array(20).fill(0).map((_, i) => {
        const id = i + offset + 1
        return { id, name: `${query || 'Item'} ${id}`, description: `Description` }
      })
      if (offset === 0) {
        items = newItems
      } else {
        items = [...items, ...newItems]
      }
      autocompleteState = { loading: false, items, offset }
      setAutocompleteState(autocompleteState)
    }, 500)
  }

  const loadMoreAutocompleteItems = (query: string) => {
    loadAutocompleteItems(query, autocompleteState.offset + 20)
  }

  const form = useForm<FormValues>({ schema, defaultValues })
  const lastNameRef = useRef<NativeMethods>(null)

  useEffect(() => {
    form.setError('textInput2', { message: 'Error message' })
  }, [])
  
  return (
    <ScrollContainer safe="top" padding>
      <FormProvider {...form}>
        <Field<FormValues>
          name="textInput1"
          render={({ onChange, ...props }) => (
            <InputGroup label="TextInput" info="Info">
              <TextInput
                {...props}
                disabled={disabled}
                placeholder="Placeholder"
                autoFocus
                returnKeyType="done"
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
                disabled={disabled}
                ref={lastNameRef}
                autoFocus
                returnKeyType="done"
                onChangeText={onChange} />
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
                disabled={disabled}
                placeholder="Search"
                clearable
                loading={autocompleteState.loading}
                itemLabelExtractor={item => item.name}
                itemPropsExtractor={item => ({ title: item.name, subtitle: item.description })}
                items={autocompleteState.items}
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
                disabled={disabled}
                placeholder="Search"
                clearable
                loading={autocompleteState.loading}
                itemLabelExtractor={item => item.name}
                items={[
                  { id: 1, name: 'Austin' },
                  { id: 2, name: 'Los Angeles' },
                  { id: 3, name: 'New York' },
                  { id: 4, name: 'San Francisco' }
                ]}/>
            </InputGroup>
          )} />

        <Field<FormValues>
          name="switch"
          render={({ onChange, ...props }) => (
            <InputGroup inline label="Switch">
              <Switch
                {...props}
                disabled={disabled}
                onValueChange={onChange} />
            </InputGroup>
          )} />
      </FormProvider>
    </ScrollContainer>
  )
}
