require('../models/user-model')
const Base = require('../bin/base/repository-base')
const bcrypt = require('bcryptjs')

class userRepository {
  constructor () {
    this._base = new Base('User')
    this._projection = 'name email'
  }

  async authenticate (email, password, flag) {
    const user = await this._base._model.findOne({
      email: email
    })

    const userResponse = await this._base._model.findOne(
      {
        email: email
      },
      this._projection
    )

    if (await bcrypt.compareSync(password, user.password)) {
      return userResponse
    }

    return null
  }

  async existsUserByEmail (email) {
    return await this._base._model.findOne(
      {
        email: email
      },
      this._projection
    )
  }

  async create (data, req) {
    const userCreated = await this._base.create(data)
    return userCreated
  }

  async update (id, data, userLogged) {
    if (userLogged._id === id) {
      if (
        data.oldPassword !== data.password &&
        data.oldPassword &&
        data.password !== undefined &&
        data.password_confirmation !== undefined &&
        data.password === data.password_confirmation
      ) {
        const user = await this._base._model.findOne({ _id: id })
        if (await bcrypt.compareSync(data.oldPassword, user.password)) {
          const salt = await bcrypt.genSaltSync(10)
          const _hashPassword = await bcrypt.hashSync(data.password, salt)
          let name = user.name
          let email = user.email
          if (data.email) {
            email = data.email
          }
          if (data.name) {
            name = data.name
          }
          const userUpdated = await this._base.update(id, {
            name: name,
            email: email,
            password: _hashPassword
          })
          return this._base._model.findById(userUpdated._id, this._projection)
        } else {
          return { message: 'Invalid password' }
        }
      } else {
        return { message: "You don't have permission to update this user" }
      }
    }
  }

  async getAll () {
    return await this._base.getAll()
  }

  async delete (id) {
    return await this.base.delete(id)
  }
}

module.exports = userRepository
