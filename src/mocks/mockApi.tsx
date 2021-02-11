import jest from 'jest-mock'
import { ApiResponseBody, ApiServerError } from 'lib/api'
import { api } from 'services'
import { FunctionPropertyNames } from 'utils/types'

interface MockApiOptions {
  delay?: number
}

interface MockApiSuccessResult extends Omit<ApiResponseBody, 'error'> {}

interface MockApiErrorResult {
  message?: string
  status?: number
  code?: string
  parameters?: { [key: string]: string[] }
}

type MockApiSuccessResultParam = MockApiSuccessResult | ((...args: any[]) => MockApiSuccessResult)
type MockApiErrorResultParam = MockApiErrorResult | ((...args: any[]) => MockApiErrorResult)

export const mockApi = {
  success<T extends {}, M extends FunctionPropertyNames<T>>(
    apiObj: T,
    methodName: M,
    result?: MockApiSuccessResultParam,
    options?: MockApiOptions
  ) {
    return jest.spyOn(apiObj, methodName).mockImplementation((...args) => (
      mockResponse('success', args, result, options)
    ) as any)
  },

  error<T extends {}, M extends FunctionPropertyNames<T>>(
    apiObj: T,
    methodName: M,
    result?: MockApiErrorResultParam,
    options?: MockApiOptions
  ) {
    return jest.spyOn(apiObj, methodName).mockImplementation((...args) => (
      mockResponse('error', args, result, options)
    ) as any)
  },

  resolve<T extends {}, M extends FunctionPropertyNames<T>>(
    apiObj: T,
    methodName: M,
    callback: (params: {
      args: any[],
      success: (result?: MockApiSuccessResultParam) => void,
      error: (result?: MockApiErrorResultParam) => void
    }) => void,
    options: any
  ) {
    return jest.spyOn(apiObj, methodName).mockImplementation(async (...args) => new Promise((resolve, reject) => {
      callback({
        args,
        success: async (result?: object) => {
          const res: any = await mockResponse('success', args, result, options)
          resolve(res)
        },
        error: async (result?: object) => {
          try {
            mockResponse('error', args, result, options)
          } catch (error) {
            reject(error)
          }
        }
      })
    }))
  }
}

async function mockResponse(
  type: string,
  args: any[],
  result?: MockApiSuccessResultParam | MockApiErrorResultParam,
  options: MockApiOptions = {}
) {
  const { delay = 300 } = options
  
  if (typeof result === 'function') {
    result = result(...args)
  }
  
  await new Promise(resolve => setTimeout(resolve, delay))
  
  if (type === 'success') {
    return { status: 200, ...result }
  }

  if (type === 'error') {
    if (!(result instanceof Error)) {
      const { message = 'Error', status = 500, code, parameters } = (result || {}) as ApiServerError
      result = new ApiServerError(message, status, code, parameters)
    }
    api.client.emit('error', { url: '', method: '', error: result })
    throw result
  }
}
