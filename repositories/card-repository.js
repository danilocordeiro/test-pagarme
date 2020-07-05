require('../models/card-model')
const Base = require('../bin/base/repository-base')

class cardRepository {
  constructor () {
    this._base = new Base('Card')
  }

  async getMyAll (user) {
    return await this._base.getMyAll(user)
  }

  async delete (id, user) {
    const model = await this._base.getById(id)
    if (model.userId.toStrint() === user._id) {
      return await this._base.delete(id)
    }

    return 'Invalid operation';
  }

  async getById (id) {
    return await this._base.getById(id)
  }

  async create (data) {
    const card = await this._base.create(data)
    return card
  }
}
