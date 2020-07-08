const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Repository = require('../repositories/user-repository')
const Validation = require('../bin/helpers/validation')
const ctrlBase = require('../bin/base/controller-base')
const variables = require('../bin/configuration/variables')

const _repo = new Repository()

function userController () {}

userController.prototype.post = async (req, res) => {
  const _validationContract = new Validation()
  console.log('to aqui')

  _validationContract.isRequired(req.body.name, 'Your name')
  _validationContract.isRequired(req.body.email, 'Your e-mail')
  _validationContract.isRequired(req.body.password, 'Your password')
  _validationContract.isRequired(
    req.body.password_confirmation,
    'Your password confirmation'
  )
  _validationContract.isTrue(
    req.body.password_confirmation !== req.body.password,
    'Your passwords must be equals'
  )
  _validationContract.isEmail(req.body.email, 'Send a valid e-mail')
  console.log('to aqui')
  try {
    const existsUserByEmail = await _repo.existsUserByEmail(req.body.email)
    if (existsUserByEmail) {
      console.log('to aqui')
      _validationContract.isTrue(
        existsUserByEmail.name !== undefined,
        `The email ${req.body.email} is already registered`
      )
    }
    const salt = await bcrypt.genSaltSync(10)
    req.body.password = await bcrypt.hashSync(req.body.password, salt)
    ctrlBase.post(_repo, _validationContract, req, res)
  } catch (e) {
    res.status(500).send({
      message: 'Internal Server Error',
      error: e
    })
  }
}

userController.prototype.put = async (req, res) => {
  const _validationContract = new Validation()
  _validationContract.isRequired(req.body.name, 'Your name')
  _validationContract.isRequired(req.params.id, 'Your id')
  _validationContract.isRequired(req.body.email, 'Your e-mail')
  _validationContract.isRequired(req.body.password, 'Your password')
  _validationContract.isRequired(
    req.body.password_confirmation,
    'Your password confirmation'
  )
  _validationContract.isTrue(
    req.body.password_confirmation !== req.body.password,
    'Your passwords must be equals'
  )
  _validationContract.isEmail(req.body.email, 'Send a valid e-mail')

  try {
    const existsUserByEmail = await _repo.existsUserByEmail(req.body.email)
    if (existsUserByEmail) {
      console.log(existsUserByEmail._id)
      console.log(req.params.id)
      console.log(existsUserByEmail._id.toString() !== req.params.id)
      _validationContract.isTrue(
        existsUserByEmail.name !== undefined &&
          existsUserByEmail._id.toString() !== req.params.id,
        `The email ${req.body.email} is already registered`
      )
    }
    if (req.userLogged.user._id.toString() === req.params.id) {
      ctrlBase.put(_repo, _validationContract, req, res)
    } else {
      res.status(401).send({ message: 'Unauthorized' })
    }
  } catch (e) {
    console.log(e)

    res.status(500).send({
      message: 'Internal Server Error',
      error: e
    })
  }
}

userController.prototype.completeRegister = async (req, res) => {
  try {
    const validationContract = new Validation()
    validationContract.isRequired(req.body.cpf, 'Your cpf')
    validationContract.isRequired(req.body.phone, 'your phone')
    if (!validationContract.isValid()) {
      req
        .status(400)
        .send({
          message: 'Invalid data in request',
          validation: validationContract.errors()
        })
        .end()
      return
    }
    const data = req.body
    const user = await _repo.completeRegister(data, req.userLogged.user._id)
    res.status(200).send(user)
  } catch (e) {
    res.status(500).send({ message: 'Internal server error', error: e })
  }
}

userController.prototype.get = async (req, res) => {
  ctrlBase.get(_repo, req, res)
}

userController.prototype.delete = async (req, res) => {
  const _validationContract = new Validation()
  _validationContract.isRequired(req.params.id, 'Your id')
  ctrlBase.get(_repo, req, res)
}

userController.prototype.authenticate = async (req, res) => {
  const _validationContract = new Validation()
  _validationContract.isRequired(req.body.email, 'Your e-mail')
  _validationContract.isRequired(req.body.password, 'Your password')
  _validationContract.isRequired(
    req.body.password_confirmation,
    'Your password confirmation'
  )
  _validationContract.isTrue(
    req.body.password_confirmation !== req.body.password,
    'Your passwords must be equals'
  )
  _validationContract.isEmail(req.body.email, 'Send a valid e-mail')

  if (!_validationContract.isValid()) {
    res.status(400).send({
      message: 'Error to login',
      validation: _validationContract.errors()
    })
    return
  }
  const userFound = await _repo.authenticate(
    req.body.email,
    req.body.password,
    false
  )
  if (userFound === null) {
    res.status(400).send({
      message: 'user or password are invalid'
    })
  }
  if (userFound) {
    res.status(200).send({
      user: userFound,
      token: jwt.sign(
        {
          user: userFound
        },
        variables.Security.secretKey
      )
    })
  } else {
    res.status(400).send({
      message: 'user or password are invalid'
    })
  }
}

module.exports = userController
