export default class DefaultAdapter {
  build(Model, props) {
    const model = new Model()
    this.set(props, model, Model)
    return model
  }
  save(model, _Model) {
    return model
  }
  destroy(model, _Model) {
    return model
  }
  get(model, attr, _Model) {
    return model[attr]
  }
  set(props, model, _Model) {
    return Object.assign(model, props)
  }
}
