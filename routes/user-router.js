const router = require('express').Router()
const Controller = require('../controllers/user-controller')
const auth = require('../middlewares/authentication')
const _ctrl = new Controller()

router.post('/register', _ctrl.post)
router.post('/authenticate', _ctrl.authenticate)
router.put('/complete-register', auth, _ctrl.completeRegister)
router.get('/', auth, _ctrl.get)
router.put('/:id', auth, _ctrl.put)
router.delete('/:id', auth, _ctrl.delete)

module.exports = router
