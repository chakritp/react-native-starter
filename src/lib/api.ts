import EventEmitter from 'event-emitter'
import RNSimpleCrypto from 'react-native-simple-crypto'
import { camelizeKeys, decamelizeKeys } from 'humps'
import grab, { GrabOptions, addQueryString } from 'lib/grab'

export interface ApiSigningOptions {
  key: string
  keyId: string
}

export interface ApiMethodOptions extends Omit<GrabOptions, 'method' | 'body'> {
  data?: { [key: string]: any }
}

export interface ApiResponseBody {
  data?: { [key: string]: any }
  pagination?: {
    page: number
    total: number
  },
  error?: {
    message: string
    code: string
    parameters?: { [key: string]: any }[]
  },
}

export declare interface ApiClient {
  on(event: 'success', listener: (
    params: {
      url: string
      method: string
      status: number
      data?: { [key: string]: any }
      body?: { [key: string]: any }
    }) => void
  ): this
  on(event: 'error', listener: (
    params: {
      url: string
      method: string
      body?: { [key: string]: any }
      error: Error
    }) => void
  ): this
  off(event: string, listener: Function): this
  emit(event: string, ...args: any[]): this
}

export class ApiClient {
  baseUrl: string
  authToken?: string
  defaultHeaders: { [key: string]: string }
  signingOptions?: ApiSigningOptions
  getSigningOptions?: () => Promise<ApiSigningOptions>

  constructor(options: {
    baseUrl: ApiClient['baseUrl']
    authToken?: ApiClient['authToken']
    defaultHeaders?: ApiClient['defaultHeaders']
    getSigningOptions?: ApiClient['getSigningOptions']
  }) {
    this.baseUrl = options.baseUrl || ''
    this.authToken = options.authToken
    this.defaultHeaders = {
      'Accept': 'application/json',
      ...options.defaultHeaders
    }
    this.getSigningOptions = options.getSigningOptions
  }

  async get(path: string, params?: { [key: string]: any }, options?: ApiMethodOptions) {
    return this.fetch(path, 'GET', { params, ...options })
  }

  async post(path: string, data?: ApiMethodOptions['data'], options?: ApiMethodOptions) {
    return this.fetch(path, 'POST', { data, ...options })
  }

  async put(path: string, data?: ApiMethodOptions['data'], options?: ApiMethodOptions) {
    return this.fetch(path, 'PUT', { data, ...options })
  }

  async patch(path: string, data?: ApiMethodOptions['data'], options?: ApiMethodOptions) {
    return this.fetch(path, 'PATCH', { data, ...options })
  }

  async delete(path: string, options?: ApiMethodOptions) {
    return this.fetch(path, 'DELETE', options)
  }

  async fetch(path: string, method: string, options: ApiMethodOptions = {}) {
    let { headers, params, data, timeout = 10000, signal } = options
    let relativeUrl = params ? addQueryString(path, decamelizeKeys(params)) : path
    const url = join(this.baseUrl, relativeUrl)

    headers = { ...this.defaultHeaders, ...headers }

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`
    }

    let body = ''
    let jsonBody: { [key: string]: any } | undefined

    if (method === 'POST' || method === "PUT" || method === 'PATCH') {
      headers['Content-Type'] = 'application/json'
      jsonBody = data ? decamelizeKeys(data) : {}
      body = JSON.stringify(jsonBody)
    }

    if (!this.signingOptions && this.getSigningOptions) {
      this.signingOptions = await this.getSigningOptions()
    }

    if (this.signingOptions) {
      const signatureHeaders = await signRequest({
        ...this.signingOptions,
        request: { url: relativeUrl, method, headers, body }
      })
      Object.assign(headers, signatureHeaders)
    }

    return grab(url, { method, headers, body, timeout, signal })
      .catch(err => {
        throw new ApiNetworkError(err.message)
      })
      .then(response => {
        return response.json()
          .catch(_err => ({}))
          .then(body => {
            const parsedBody = camelizeKeys(body) as ApiResponseBody

            if (!response.ok) {
              const { error } = parsedBody
              let message = 'Server Error'
              let code: string = '0'
              let parameters: ApiServerError['parameters'] | undefined

              if (error) {
                message = error.message
                code = error.code
                if (error.parameters) {
                  for (const paramSet of error.parameters) {
                    parameters = { ...parameters, ...paramSet }
                  }
                }
              }

              throw new ApiServerError(
                message,
                response.status,
                code,
                parameters
              )
            }

            this.emit('success', { url, method, status: response.status, data, body })
            return parsedBody
          })
      })
      .catch((error: Error) => {
        this.emit('error', { url, method, error, body: jsonBody })
        throw error
      })
  }
}

EventEmitter(ApiClient.prototype)

export class ApiClientError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ApiClientError.prototype)
  }
}

export class ApiNetworkError extends ApiClientError {
  status: number

  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, ApiNetworkError.prototype)
    this.name = 'NetworkError'
    this.status = 0
  }
}

export class ApiServerError extends ApiClientError {
  status: number
  code: string
  parameters: { [key: string]: string[] }
  
  constructor(message: string, status: number, code: string, parameters = {}) {
    super(message)
    Object.setPrototypeOf(this, ApiServerError.prototype)
    this.name = 'ServerError'
    this.status = status
    this.code = code
    this.parameters = parameters
  }
}

function join(...segments: string[]) {
  return segments
    .filter(s => s != null)
    .map((s, i) => i > 0 && s.startsWith('/') ? s.slice(1) : s)
    .join('/')
}

async function signRequest({
  key,
  keyId,
  request
} : { key: string, keyId: string, request: any }) {
  const curDate = new Date().toUTCString()

  const sha256DigestHex = await RNSimpleCrypto.SHA.sha256(request.body)
  const sha256DigestBytes = RNSimpleCrypto.utils.convertHexToArrayBuffer(sha256DigestHex)
  const sha256DigestBase64 = RNSimpleCrypto.utils.convertArrayBufferToBase64(sha256DigestBytes)
  const computedDigest = 'sha-256=' + sha256DigestBase64

  const method = request.method.toLowerCase()

  const headers = {
    date: curDate,
    digest: computedDigest,
    '(request-target)': method + ' ' + request.url
  }

  const secretKeyMsgBytes = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(`${keyId}\n${curDate}`)
  const keyBytes = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(key)
  const secretKeyBytes = await RNSimpleCrypto.HMAC.hmac256(secretKeyMsgBytes, keyBytes)
  const secretKey = RNSimpleCrypto.utils.convertArrayBufferToHex(secretKeyBytes)

  const signature = await computeHttpSignature({
    keyId,
    secretKey,
    headerKeys: ['(request-target)', 'digest', 'date'],
    headers
  })

  return {
    Date: curDate,
    Digest: computedDigest,
    Signature: signature
  }
}

async function computeHttpSignature({
  keyId,
  secretKey,
  headerKeys,
  headers
} : { keyId: string, secretKey: string, headerKeys: string[], headers: { [key: string]: string } }) {
  let signingBase = ''
  for (const h of headerKeys) {
    if (signingBase !== '') { signingBase += '\n' }
    signingBase += h.toLowerCase() + ": " + headers[h]
  }

  const signingBaseBytes = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(signingBase)
  const secretKeyBytes = RNSimpleCrypto.utils.convertUtf8ToArrayBuffer(secretKey)
  const signatureBytes = await RNSimpleCrypto.HMAC.hmac256(signingBaseBytes, secretKeyBytes)
  const signature = RNSimpleCrypto.utils.convertArrayBufferToBase64(signatureBytes)

  return `keyId="${keyId}",algorithm=hmac-sha256,headers="${headerKeys.join(' ')}",signature="${signature}"`
}
