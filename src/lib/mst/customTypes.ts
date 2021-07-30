import { format as formatDate } from 'date-fns'
import { types } from 'mobx-state-tree'

export const isoDate = types.custom({
  name: 'isoDate',
  fromSnapshot: value => new Date(value),
  toSnapshot: (date: any) => date.toISOString(),
  isTargetType: value => value instanceof Date,
  getValidationMessage: (snapshot: any) => {
    if (isNaN(new Date(snapshot) as any)) {
      return `${snapshot} is not in a valid date format`
    }
    return ''
  }
})

export const date = types.custom({
  name: 'date',
  fromSnapshot: value => new Date(value),
  toSnapshot: (date: any) => formatDate(date, 'Y-MM-dd'),
  isTargetType: value => value instanceof Date,
  getValidationMessage: (snapshot: any) => {
    if (isNaN(new Date(snapshot) as any)) {
      return `${snapshot} is not in a valid date format`
    }
    return ''
  }
})
