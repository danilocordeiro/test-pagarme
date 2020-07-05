const Repository = require('../repositories/card-repository')
const Validation = require('../bin/helpers/validation')
const ctrlBase = require('../bin/base/controller-base')
const variables = require('../bin/configuration/variables')

const _repo = new Repository()

function cardController () {}

cardController.prototype.get = async (req, res) => {
  ctrlBase.getMyAll(_repo, req, res)
};

cardController.prototype.delete = async (req, res) => {
  ctrlBase.delete(_repo, req, res)
};

module.exports = cardController
