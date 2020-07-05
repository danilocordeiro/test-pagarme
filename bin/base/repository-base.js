const mongoose = require('mongoose')

class baseRepository {
  constructor (model) {
    this._model = mongoose.model(model)
  }

  async create (data) {
    const model = new this._model(data)
    const result = await model.save()
    return result
  }

  async update (id, data, userLogged) {
    await this._model.findByIdAndUpdate(id, { $set: data })
    const result = await this._model.findById(id)
    return result
  }

  async getAll () {
    return await this._model.find({})
  }

  async getMyAll (user) {
    return await this._model.find({ userId: user._id })
  }

  async delete (id) {
    return await this._model.findByIdAndDelete(id)
  }

  async getById (id) {
    return await this._model.findById(id)
  }
}

module.exports = baseRepository
