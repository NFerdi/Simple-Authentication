require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Authentication = require('./routes/authentication.routes')
const AccountManagment = require('./routes/accountManagment.routes')
const PORT = process.env.PORT || 3000
const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: '*'
}));

app.use('/api/v1/authentication/', Authentication)
app.use('/api/v1/user/', AccountManagment)

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})

