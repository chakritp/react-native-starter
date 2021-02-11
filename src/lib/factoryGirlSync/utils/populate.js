export default function populate(target, source) {
  if (typeof target !== 'object') {
    throw new Error('Invalid target passed')
  }
  if (typeof source !== 'object') {
    throw new Error('Invalid source passed')
  }

  return Object.keys(source).map(attr => {
    if (Array.isArray(source[attr])) {
      target[attr] = []
      return populate(target[attr], source[attr])
    } else if (source[attr] === null || source[attr] === undefined) {
      target[attr] = source[attr]
    } else if (isPlainObject(source[attr])) {
      target[attr] = target[attr] || {}
      return populate(target[attr], source[attr])
    } else if (typeof source[attr] === 'function') {
      target[attr] = source[attr]()
    } else {
      target[attr] = source[attr]
    }
  })
}

const objectProto = Object.getPrototypeOf({})
function isPlainObject(o) {
  return Object.getPrototypeOf(o) === objectProto
}
