import Factory from './Factory'
import Sequence from './generators/Sequence'
import Assoc from './generators/Assoc'
import AssocAttrs from './generators/AssocAttrs'
import AssocMany from './generators/AssocMany'
import AssocAttrsMany from './generators/AssocAttrsMany'
import ChanceGenerator from './generators/ChanceGenerator'
import OneOf from './generators/OneOf'
import DefaultAdapter from './adapters/DefaultAdapter'

export default class FactoryGirl {
  factories = {}
  options = {}
  adapters = {}
  created = new Set()

  constructor(options = {}) {
    this.assoc = generatorThunk(this, Assoc)
    this.assocMany = generatorThunk(this, AssocMany)
    this.assocAttrs = generatorThunk(this, AssocAttrs)
    this.assocAttrsMany = generatorThunk(this, AssocAttrsMany)
    this.seq = this.sequence =
      (...args) => generatorThunk(this, Sequence)(...args)
    this.resetSeq = this.resetSequence = id => { Sequence.reset(id) }
    this.chance = generatorThunk(this, ChanceGenerator)
    this.oneOf = generatorThunk(this, OneOf)

    this.defaultAdapter = new DefaultAdapter()
    this.options = options
  }

  define(name, Model, initializer, options = {}) {
    // This breaks on fast refresh:
    // if (this.getFactory(name, false)) {
    //   throw new Error(`Factory ${name} already defined`)
    // }
    const factory = this.factories[name] = new Factory(Model, initializer, options)
    return factory
  }

  extend(parent, name, childInitializer, options = {}) {
    // This breaks on fast refresh:
    // if (this.getFactory(name, false)) {
    //   throw new Error(`Factory ${name} already defined`)
    // }
    const parentFactory = this.getFactory(parent, true)
    const Model = options.model || parentFactory.Model
    let jointInitializer

    function resolveInitializer(initializer, buildOptions) {
      return typeof initializer === 'function' ? initializer(buildOptions) : initializer
    }

    if (
      typeof parentFactory.initializer === 'function' ||
      typeof childInitializer === 'function'
    ) {
      jointInitializer = function initializer(buildOptions = {}) {
        return Object.assign(
          {},
          resolveInitializer(parentFactory.initializer, buildOptions),
          resolveInitializer(childInitializer, buildOptions)
        )
      }
    } else {
      jointInitializer = Object.assign({}, parentFactory.initializer, childInitializer)
    }

    const factory = this.factories[name] = new Factory(Model, jointInitializer, options)
    return factory
  }

  attrs(name, attrs, buildOptions = {}) {
    return this.getFactory(name).attrs(attrs, buildOptions)
  }

  build(name, attrs = {}, buildOptions = {}) {
    const adapter = this.getAdapter(name)
    const model = this.getFactory(name).build(adapter, attrs, buildOptions)
    return this.options.afterBuild
      ? this.options.afterBuild(model, attrs, buildOptions)
      : model
  }

  create(name, attrs, buildOptions = {}) {
    const adapter = this.getAdapter(name)
    const model = this.getFactory(name).create(adapter, attrs, buildOptions)
    this.addToCreatedList(adapter, model)
    return this.options.afterCreate
      ? this.options.afterCreate(model, attrs, buildOptions)
      : model
  }

  attrsMany(name, num, attrs, buildOptions = {}) {
    return this.getFactory(name).attrsMany(num, attrs, buildOptions)
  }

  buildMany(name, num, attrs, buildOptions = {}) {
    const adapter = this.getAdapter(name)
    const models = this.getFactory(name).buildMany(adapter, num, attrs, buildOptions)
    return this.options.afterBuild
      ? models.map(model => this.options.afterBuild(model, attrs, buildOptions))
      : models
  }

  createMany(name, num, attrs, buildOptions = {}) {
    const adapter = this.getAdapter(name)
    const models = this.getFactory(name).createMany(adapter, num, attrs, buildOptions)
    this.addToCreatedList(adapter, models)
    return this.options.afterCreate
      ? models.map(model => this.options.afterCreate(model, attrs, buildOptions))
      : models
  }

  buildBulk(name, attrsArray, buildOptions = {}) {
    const adapter = this.getAdapter(name)
    const factory = this.getFactory(name)
    const models = attrsArray.map(attrs => factory.build(adapter, attrs, buildOptions))
    return this.options.afterBuild
      ? models.map((model, i) => this.options.afterBuild(model, attrsArray[i], buildOptions))
      : models
  }

  createBulk(name, attrsArray, buildOptions = {}) {
    const adapter = this.getAdapter(name)
    const factory = this.getFactory(name)
    const models = attrsArray.map(attrs => {
      const model = factory.create(adapter, attrs, buildOptions)
      this.addToCreatedList(adapter, model)
      return model
    })
    return this.options.afterCreate
      ? models.map((model, i) => this.options.afterCreate(model, attrsArray[i], buildOptions))
      : models
  }

  getFactory(name, throwError = true) {
    if (!this.factories[name] && throwError) {
      throw new Error(`Invalid factory '${name}' requested`)
    }
    return this.factories[name]
  }

  withOptions(options, merge = false) {
    this.options = merge ? { ...this.options, ...options } : options
  }

  getAdapter(factory) {
    return factory ?
      (this.adapters[factory] || this.defaultAdapter) :
      this.defaultAdapter
  }

  addToCreatedList(adapter, models) {
    if (!Array.isArray(models)) {
      this.created.add([adapter, models])
    } else {
      for (const model of models) {
        this.created.add([adapter, model])
      }
    }
    return models
  }

  cleanUp() {
    const createdArray = []
    for (const c of this.created) {
      createdArray.push(c)
    }
    for (const [adapter, model] of createdArray) {
      adapter.destroy(model, model.constructor)
    }
    this.created.clear()
    this.resetSeq()
  }

  setAdapter(adapter, factoryNames = null) {
    if (!factoryNames) {
      this.defaultAdapter = adapter
    } else {
      factoryNames = Array.isArray(factoryNames) ? factoryNames : [factoryNames]
      factoryNames.forEach(name => {
        this.adapters[name] = adapter
      })
    }
    return adapter
  }
}

export function generatorThunk(factoryGirl, SomeGenerator) {
  const generator = new SomeGenerator(factoryGirl)
  return (...args) => () => generator.generate(...args)
}
