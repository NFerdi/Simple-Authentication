const db = require("../models")
const { cloudinary } = require('../config/cloudinary.config')
const { HandlingError, HandlingResponse } = require("../utils/HandlingResponse.utils")

const handleDataAccount = (req, res, next) => {
	db.User.findOne({
		where: {
			id: req.user.userId
		}
	}).then(user => {
		if(user){
			return HandlingResponse(res, 200, 'successfully retrieve account data', user)
		}else{
			return HandlingError(res, 401, 'account could not be found', [])
		}
	})
}

const handleEditAccount = (req, res, next) => {
	if(req.body.username || req.body.email || req.file){
		db.User.findOne({
			where: {
				id: req.user.userId
			}
		}).then(async(user) => {
			if(user){
				if(req.body.username){
					user.username = req.body.username
					console.log('username')
				}
				if(req.body.email){
					user.email = req.body.email
					console.log('email')
				}
				if(req.file){
					const upload = await cloudinary.uploader.upload(req.file.path)
					user.avatar = upload.secure_url
					console.log('avatar')
				}
				user.save()
				return HandlingResponse(res, 200, 'successfully changed account data', [])
			}else{
				return HandlingError(res, 401, 'account could not be found', [])
			}
		})
	}else{
		return HandlingError(res, 401, 'enter the data to be changed', [])
	}
}

const handleDeleteAccount = (req, res, next) => {
	db.User.findOne({
		where: {
			id: req.user.userId
		}
	}).then(user => {
		if(user){
			user.destroy()
			return HandlingResponse(res, 200, 'successfully deleted account data', [])
		}else{
			return HandlingError(res, 401, 'account could not be found', [])
		}
	})
}

module.exports = {
	handleDataAccount,
	handleEditAccount,
	handleDeleteAccount
}