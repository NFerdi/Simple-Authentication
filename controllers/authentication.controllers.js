require('dotenv').config()
const utilsValidator = require('../utils/authenticationValidator.utils')
const EmailService = require('../utils/EmailService.utlis')
const db = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { HandlingError, HandlingResponse } =  require('../utils/HandlingResponse.utils')

const LoginSystem = async (req, res, next) => {
	const data = {
		email: req.body.email,
		password: req.body.password
	}
	const schema = {
		email: [
			'required',
			'email'
		],
		password: [
			'required'
		]
	}
	utilsValidator(req.body, schema, errors => {
		if(errors.length > 0){
			HandlingError(res, 401, 'failed to pass validator', errors)
		}else{
			db.User.findOne({
				where: {
					email: data.email
				}
			}).then(user => {
				if(user){
					if(!user.isActive){
						HandlingError(res, 401, 'Please activate the account first before logging in', [])
					}else{
						bcrypt.compare(data.password, user.password, (err, equal) => {
						if(err) console.log(err)
						if(equal === true){
							const token = jwt.sign(
								{userId: user.id},
								process.env.TOKEN_JWT,
								{
									expiresIn: '30d'
								}
							)
							HandlingResponse(res, 200, 'successfully login', {token: token})
						}else{
							HandlingError(res, 401, 'the password you entered is wrong', [])
						}
					})
					}
				}else{
					HandlingError(res, 401, 'account could not be found', [])
				}
			})
		}
	})
}

const SignupSystem = async (req, res, next) => {
	const data = {
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
	}

	const schema = {
		username: [
			'required'
		],
		email: [
			'required',
			'email'
		],
		password: [
			'required',
			'PasswordStrength'
		],
	}

	utilsValidator(req.body, schema, errors => {
		if(errors.length > 0){
			HandlingError(res, 401, 'failed to pass validator', errors)
		}else{
			db.User.findOne({
				where: {
					email: data.email
				}
			}).then(userExist => {
				if(userExist){
					HandlingError(res, 401, 'Email already used', [])
				}else{
					db.User.create({
						username: data.username,
						email: data.email,
						password: hashPassword(data.password)
					}).then((user) => {
						const token = jwt.sign(
						{
							userId: user.id,
						},
						process.env.TOKEN_JWT,
						{
							expiresIn: '1d'
						}
					)
					EmailService.Send(user.email, token, 'email')
						HandlingResponse(res, 200, 'successfully registered an account, please check your email for activation', [])
					})
				}
			})
		}
	})
}

const ResendEmail = (req, res, next) => {
	const schema = {
		email: [
			'required'
		]
	}
	utilsValidator(req.body, schema, errors => {
		if(errors.length > 0){
			HandlingError(res, 401, 'failed to pass validator', errors)
		}else{
			db.User.findOne({
				where: {
					email: req.body.email
				}
			}).then(user => {
				if(user){
					if(req.query.type === 'password'){
						const token = crypto.randomBytes(2).toString('hex')
						const now = new Date()
						const expireDate = now.getTime() + 1000*3600
						db.ResetPasswordToken.create({
							userId: user.id,
							token: token,
							expired: expireDate
						}).then(userToken => {
							EmailService.Send(user.email, token, 'password')
						})
					}else if(req.query.type === 'email'){
						const token = jwt.sign(
							{
								userId: user.id,
							},
							process.env.TOKEN_JWT,
							{
								expiresIn: '1d'
							}
						)
						EmailService.Send(user.email, token, 'email')
					}
					HandlingResponse(res, 200, 'verification email has been re-sent', [], [])
				}else{
					HandlingError(res, 401, 'account could not be found', [])
				}
			})
		}
	})
}

const VerifySystem = async (req, res, next) => {
	const token = jwt.decode(req.params.token)
	if(Date.now() <= token.exp * 1000){
		db.User.findOne({
			where: {
				id: token.userId
			}
		}).then(user => {
			if(!user.isActive){
				user.isActive = true
				user.save()
				HandlingResponse(res, 200, 'Success Activated Account', [])
			}else{
				HandlingError(res, 401, 'tokens can no longer be used', [])
			}
		})
	}else{
		HandlingError(res, 401, 'Token is expired', [])
	}
}

const handleForgotPassword = (req, res, next) => {
	const data = {
		token: req.body.token,
		newPassword: req.body.newPassword
	}
	const schema = {
		newPassword: [
			'required',
			'PasswordStrength'
		]
	}
	utilsValidator(req.body, schema, errors => {
		if(errors.length > 0){
			HandlingError(res, 401, 'failed to pass validator', errors)
		}else{
			db.ResetPasswordToken.findOne({
				where: {
					token: data.token
				}
			}).then((token) => {
				if(token){
					if(Date.now() <= token.expired){
						db.User.findOne({
							where: {
								id: token.userId
							}
						}).then(user => {
							user.password = hashPassword(data.newPassword)
							user.save()
						})
						token.destroy()
						HandlingResponse(res, 200, 'Successfully changed password', [])
					}else{
						HandlingError(res, 401, 'Token is expired', [])
					}
				}else{
					HandlingError(res, 401, 'tokens can no longer be used', [])
				}
			})
		}
	})
}

const handleChangePassword = (req, res, next) => {
	const data = {
		newPassword: req.body.newPassword,
		confirmNewPassword: req.body.confirmNewPassword
	}
	const schema = {
		newPassword: [
			'required',
			'PasswordStrength'
		],
		confirmNewPassword: [
			'required',
			'PasswordStrength'
		]
	}
	utilsValidator(req.body, schema, errors => {
		if(errors.length > 0){
			HandlingError(res, 401, 'failed to pass validator', errors)
		}else{
			if(data.newPassword !== data.confirmNewPassword){
				HandlingError(res, 401, 'password does not match', [])
			}else{
				db.User.findOne({
					where: {
						id: req.user.userId
					}
				}).then(user => {
					user.password = hashPassword(data.newPassword)
					user.save()
					HandlingResponse(res, 200, 'Successfully changed password', [])
				})
			}
		}
	})
}	

const hashPassword = ( password ) => {
	const salt = bcrypt.genSaltSync(10)
	const hash = bcrypt.hashSync(password, salt)
	return hash
}

module.exports = {
	LoginSystem,
	SignupSystem,
	VerifySystem,
	ResendEmail,
	handleForgotPassword,
	handleChangePassword
}