const HandleErrors = (err, type) => {
	var error = {}
	const MessageOption = {
		'empty': 'This field is required',
		'email': 'This field must be in email format',
		'password': 'password must include at least one uppercase character and at least one lowercase letter and at least one number or use the symbol'
	}
	Object.keys(err).map((key, index) => {
		const MessageSelected = MessageOption[type] 
		if(err[key] === true){
			error[key] = {
				location: key,
				message: MessageSelected
			}
		}
	})
	return error
}

const PasswordStrength = (request, filtered_rules) => {
	var error = null
	var err = {}
	var strength = 0

	strength += /[A-Z]+/.test(request[filtered_rules]) ? 1 : 0
	strength += /[a-z]+/.test(request[filtered_rules]) ? 1 : 0
	strength += /[0-9]+/.test(request[filtered_rules]) ? 1 : 0
	strength += /[\W]+/.test(request[filtered_rules]) ? 1 : 0
	if(strength < 3){
		err[filtered_rules] = true
	}
	
	error = HandleErrors(err, 'password')
	return error
}

const isEmail = (request, filtered_rules) => {
	const err = {}
	var error = null

	const RegexEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	if(RegexEmail.test(request[filtered_rules]) === false){
		err[filtered_rules] = true
	}

	error = HandleErrors(err, 'email')
	return error
}

const isEmpty = (request, filtered_rules) => {
	const err = {}
	var error = null
	
	if(request[filtered_rules] == null || request[filtered_rules] == ""){
		err[filtered_rules] = true
	}
	
	error = HandleErrors(err, 'empty')
	return error
}

const checkSchema = (request, schema) => {
	var result = []
	Object.keys(schema).map((key) => {
		const arr = schema[key]
		for(var i = 0; i < arr.length; i++){
			if(arr[i] === 'required'){
				var error = isEmpty(request, key)
				result.push(error)
			}else if(arr[i] === 'email'){
				var error = isEmail(request, key)
				result.push(error)
			}else if(arr[i] === 'PasswordStrength'){
				var error = PasswordStrength(request, key)
				result.push(error)
			}
		}
	})
	result = result.filter(el => Object.keys(el).length)
	return result
}

const Validator = (request, schema, callback) => {
	var Errors = null
	if(schema){
		Errors = checkSchema(request, schema)
	}
	return callback(Errors)
}

module.exports = Validator