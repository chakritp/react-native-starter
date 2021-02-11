export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends (...args: Array<any>) => any ? K : never
}[keyof T] & string
