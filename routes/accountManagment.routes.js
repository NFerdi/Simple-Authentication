const router = require('express').Router()
const { parser } = require('../config/cloudinary.config')
const AuthCheck = require('../middlewares/authentication.middlewares')
const AccountManagmentControllers = require('../controllers/accountManagment.controllers')

router.get('', AuthCheck, AccountManagmentControllers.handleDataAccount)
router.patch('', AuthCheck, parser.single('image'), AccountManagmentControllers.handleEditAccount)
router.delete('', AuthCheck, AccountManagmentControllers.handleDeleteAccount)


module.exports = router