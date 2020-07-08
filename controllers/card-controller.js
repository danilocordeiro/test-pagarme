const Repository = require('../repositories/card-repository')
const ctrlBase = require('../bin/base/controller-base')

const _repo = new Repository()

function cardController () {}

cardController.prototype.get = async (req, res) => {
  try {
    const cards = await _repo.getMyAll(req.userLogged.user._id)
    res.status(200).send(cards)
  } catch (e) {
    res.status(500).send({ message: 'Internal server error', error: e })
  }
}

cardController.prototype.delete = async (req, res) => {
  ctrlBase.delete(_repo, req, res)
}

module.exports = cardController
