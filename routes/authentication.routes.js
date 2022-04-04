const router = require('express').Router()
const AuthCheck = require('../middlewares/authentication.middlewares')
const AuthenticationControllers = require('../controllers/authentication.controllers')

router.post('/login', AuthenticationControllers.LoginSystem)
router.post('/signup', AuthenticationControllers.SignupSystem)
router.get('/verify/:token', AuthenticationControllers.VerifySystem)
router.post('/send', AuthenticationControllers.ResendEmail)
router.post('/forgot-password', AuthenticationControllers.handleForgotPassword)
router.post('/change-password', AuthCheck, AuthenticationControllers.handleChangePassword)

module.exports = router