require('dotenv').config()
const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_JWT, (err, user) => {
            if (err) {
                return res.status(401).send("Invalid Token")
            }
            req.user = user
            next()
        })
    } else {
        return res.status(403).send("A token is required for authentication")
    }
}

module.exports = verifyToken