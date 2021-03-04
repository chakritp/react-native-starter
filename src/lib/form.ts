import { setLocale } from 'yup'

export interface FieldError {
  message: string | {
    type: string,
    params?: { [key: string]: any }
  }
}

export function configureYup() {
  setLocale({
    mixed: {
      default: { type: 'mixed.default' },
      required: { type: 'mixed.required' },
      oneOf: ({ values }: any) => ({ type: 'mixed.oneOf', params: { values } }),
      notOneOf: ({ values }: any) => ({ type: 'mixed.notOneOf', params: { values } }),
      // notType: ({ type }: any) => ({ type: `${type}.base` }),
      // defined: { type: 'mixed.defined' },
    },
    string: {
      length: ({ length }: any) => ({ type: 'string.length', params: { length } }),
      min: ({ min }: any) => ({ type: 'string.min', params: { min } }),
      max: ({ max }: any) => ({ type: 'string.max', params: { max } }),
      email: { type: 'string.email' },
      url: { type: 'string.url' },
      trim: { type: 'string.trim' },
      lowercase: { type: 'string.lowercase' },
      uppercase: { type: 'string.uppercase' },
    },
    number: {
      min: ({ min }: any) => ({ type: 'number.min', params: { min } }),
      max: ({ max }: any) => ({ type: 'number.max', params: { max } }),
      lessThan: ({ less }: any) => ({ type: 'number.lessThan', params: { less } }),
      moreThan: ({ more }: any) => ({ type: 'number.moreThan', params: { more } }),
      notEqual: ({ notEqual }: any) => ({ type: 'number.notEqual', params: { notEqual } }),
      // positive: { type: 'number.positive' },
      // negative: { type: 'number.negative' },
      // integer: { type: 'number.integer' },
    },
    date: {
      min: ({ min }: any) => ({ type: 'date.min', params: { min } }),
      max: ({ max }: any) => ({ type: 'date.max', params: { max } }),
    },
    // object: {
    //   noUnknown: ({ unknown }: any) => ({ type: 'object.noUnknown', params: { unknown } }),
    // },
    // array: {
    //   min: ({ min }: any) => ({ type: 'array.min', params: { min } }),
    //   max: ({ max }: any) => ({ type: 'array.max', params: { max } }),
    // },
  })
}
