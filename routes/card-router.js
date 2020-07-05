const router = require('express').Router()
const Controller = require('../controllers/card-controller')
const auth = require('../middlewares/authentication')
const _ctrl = new Controller()

router.get('/', auth, _ctrl.get)
//router.post('/', auth, _ctrl.post)
router.delete('/:id', auth, _ctrl.delete)

module.exports = router
