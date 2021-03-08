export function call(value: any, ...args: any[]) {
  return typeof value === 'function' ? value(...args) : value
}
