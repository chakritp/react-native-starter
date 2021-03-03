import qs from 'query-string'

export interface GrabOptions {
  method?: string,
  headers?: { [key: string]: string }
  params?: { [key: string]: any }
  body?: any
  timeout?: number
  signal?: AbortSignal
}

export default async function grab(url: string, options: GrabOptions = {}) {
  const { params, timeout, signal, ...fetchOptions } = options

  if (params) {
    url = addQueryString(url, params)
  }

  if (timeout) {
    const abortController = new AbortController()

    if (signal) {
      signal.addEventListener('abort', () => {
        abortController.abort()
      })
    }

    setTimeout(() => abortController.abort(), timeout)
  }

  return fetch(url, { signal, ...fetchOptions })
}

export function addQueryString(url: string, params: { [key: string]: any }) {
  const query = qs.stringify(filterQueryParams(params))
  if (query !== '') {
    return url + `?${query}`
  }
  return url
}

function filterQueryParams(params: { [key: string]: any }) {
  const ret: { [key: string]: any } = {}
  for (const key of Object.keys(params)) {
    if (params[key] != null) {
      ret[key] = params[key]
    }
  }
  return ret
}
