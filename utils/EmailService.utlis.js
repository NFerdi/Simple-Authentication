require('dotenv').config()
const handlebars = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')

const Send = (email, token, type) => {
	var mailOptions

	var transport = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.AUTH_EMAIL,
			pass: process.env.AUTH_PASSWORD
		},
		tls: {
			rejectUnauthorized: false
		}
	})

	var handlebarsOption = {
		viewEngine: {
			extName: ".handlebars",
			partialsDir: path.resolve('./views'),
			defaultLayout: false,
		},
		viewPath: path.resolve('./views'),
		extName: ".handlebars",
	}

	transport.use('compile', handlebars(handlebarsOption))

	if(type === 'email'){
		var mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Email Verification",
			template: "email",
			context: {
				verifyUrl: `http://localhost:3000/api/v1/authentication/verify/${token}`,
			}
		}
	}else if(type === 'password'){
		var mailOptions = {
			from: process.env.AUTH_EMAIL,
			to: email,
			subject: "Password Reset",
			template: "password",
			context: {
				token: token,
			}
		}
	}

	transport.sendMail(mailOptions, (err, info) => {
		if (err) console.log(err)
		console.log('Email send');
	});

}

module.exports = {
	Send
}