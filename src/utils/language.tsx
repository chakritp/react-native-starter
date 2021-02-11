export function call(value, ...args) {
  return typeof value === 'function' ? value(...args) : value
}
