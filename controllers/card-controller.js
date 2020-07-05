const Repository = require('../repositories/card-repository')
const ctrlBase = require('../bin/base/controller-base')

const _repo = new Repository()

function cardController () {}

cardController.prototype.get = async (req, res) => {
  ctrlBase.getMyAll(_repo, req, res)
}

cardController.prototype.delete = async (req, res) => {
  ctrlBase.delete(_repo, req, res)
}

module.exports = cardController
