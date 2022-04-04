const HandlingError = (res, statusCode, message, data) => {
	res.status(statusCode).send({
		status: statusCode,
		message: message,
		data: data
	})
}

const HandlingResponse = (res, statusCode, message, data) => {
	res.status(statusCode).send({
		status: statusCode,
		message: message,
		data: data
	})
}

module.exports = {
	HandlingError, 
	HandlingResponse
}