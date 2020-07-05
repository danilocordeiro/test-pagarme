require('../models/transaction-model')
const Base = require('../bin/base/repository-base')

class transactionRepository {
  constructor () {
    this._base = new Base('Transaction')
  }

  async getMyAll (user) {
    return await this._base.getMyAll(user)
  }

  async delete (id, user) {
    const model = await this._base.getById(id)
    if (model.userId.toStrint() === user._id) {
      return await this._base.delete(id)
    }

    return 'Invalid operation'
  }

  async getById (id) {
    return await this._base.getById(id)
  }

  async create (data) {
    const transaction = await this._base.create(data)
    return transaction
  }
}

module.exports = transactionRepository
