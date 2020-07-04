const jwt = require('jsonwebtoken')
const variables = require('../bin/configuration/variables')
const user = require('../models/user-model')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const [, token] = authHeader.split(' ')
  if (token) {
    try {
      const decoded = await jwt.verify(token, variables.Security.secretKey)
      req.userLogged = decoded
      const userExists = await user.findById(req.userLogged.user._id)
      if (!userExists) {
        res.status(401).send({ message: 'User dont exists' })
      }
      next()
    } catch (e) {
      res.status(401).send({ message: 'Invalid token' })
    }
  } else {
    res.status(401).send({ message: 'Header without token' })
  }
}
