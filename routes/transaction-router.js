const router = require('express').Router()
const Controller = require('../controllers/transaction-controller')
const auth = require('../middlewares/authentication')
const _ctrl = new Controller()

router.get('/', auth, _ctrl.get)
router.post('/', auth, _ctrl.post)
router.put('/:id', auth, _ctrl.delete)

module.exports = router
