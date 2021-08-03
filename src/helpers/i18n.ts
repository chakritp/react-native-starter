import { I18nManager } from 'react-native'
import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import * as dateFns from 'date-fns'
import { FieldError } from 'lib/form'

declare module 'i18n-js' {
  export function pluralize(count: string, scope?: string, options?: object): string
}

const locales = {
  en: require('locales/en.json')
}

const dateLocales: { [key: string]: dateFns.Locale } = {
  // es: require('date-fns/locale/es')
}

let dateLocale: dateFns.Locale | undefined

export default i18n

export function configureI18n() {
  // Fallback if no available language fits
  const fallback = { languageTag: "en", isRTL: false }

  const { languageTag, isRTL } =
    RNLocalize.findBestAvailableLanguage(Object.keys(locales)) ||
    fallback

  // Update layout direction
  I18nManager.forceRTL(isRTL)

  // Set i18n-js config
  i18n.fallbacks = true
  i18n.translations = { [languageTag]: locales[languageTag as keyof typeof locales] }
  i18n.locale = languageTag

  // Set dateLocale
  dateLocale = dateLocales[languageTag]
}

export const t = i18n.t
export const l = i18n.l
export const pluralize = i18n.pluralize.bind(i18n)
export const toNumber = i18n.toNumber.bind(i18n)
export const toCurrency = i18n.toCurrency.bind(i18n)
export const toPercentage = i18n.toPercentage.bind(i18n)
export const toHumanSize = i18n.toHumanSize.bind(i18n)

export function scopedTranslate(baseScope: string) {
  return (scope: string, options?: i18n.TranslateOptions) => t(`${baseScope}.${scope}`, {
    defaults: [{ scope }],
    ...options
  })
}

export function apiErrorMessage(error: any, options: { scope?: string } = {}) {
  const rootScope = 'messages.api'
  let { scope = 'common', ...opts } = options
  let code
  let status

  if (error && typeof error === 'object') {
    code = error.code
    status = error.status
  } else {
    code = error
  }

  return t(`${rootScope}.${scope}.${code}`, {
    defaults: [
      { scope: `${rootScope}.${scope}.${status}` },
      { scope: `${rootScope}.common.${code}` },
      { scope: `${rootScope}.common.${status}` },
      { scope: `${rootScope}.common.default` }
    ],
    ...opts
  })
}

export function fieldErrorMessage(
  error: FieldError,
  options: { form?: string, field?: string, label?: string } = {}
) {
  if (typeof error.message === 'string') {
    return error.message
  }

  const { type, params } = error.message
  const { form, field, ...translationOptions } = options
  const scopes = [
    `messages.validation.${type}`,
    'messages.validation.default'
  ]
  
  if (field) {
    const commonScope = `forms.common.fields.${field}.validation`
    scopes.unshift(
      `${commonScope}.${type}`,
      `${commonScope}.default`
    )
    
    if (form) {
      const formScope = `forms.${form}.fields.${field}.validation`
      scopes.unshift(
        `${formScope}.${type}`,
        `${formScope}.default`
      )
    }

    if (!translationOptions.label) {
      translationOptions.label = formFieldLabel(field, options)
    }
  }

  return t(scopes.shift()!, {
    ...translationOptions,
    ...params,
    defaults: scopes.map(scope => ({ scope }))
  })
}

export function formFieldLabel(field: string, options: { form?: string } = {}) {
  const { form, ...translationOptions } = options
  const commonScope = `forms.common.fields.${field}`
  const scopes = [
    `${commonScope}.label`,
    `${commonScope}.placeholder`
  ]

  if (form) {
    const formScope = `forms.${form}.fields.${field}`
    scopes.unshift(
      `${formScope}.label`,
      `${formScope}.placeholder`
    )
  }

  return t(scopes.shift()!, {
    ...translationOptions,
    defaults: scopes.map(scope => ({ scope }))
  })
}

export function translateForm(form: string, scope: string, options?: i18n.TranslateOptions) {
  return t(`forms.${form}.${scope}`, {
    defaults: [
      { scope: `forms.common.${scope}` },
      { scope }
    ],
    ...options
  })
}

export function formatDate(date: Date, format = 'PP') {
  return dateFns.format(date, format, { locale: dateLocale })
}

configureI18n()
