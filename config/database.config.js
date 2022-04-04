require('dotenv').config()

module.exports = {
  development: {
    username: 'root',
    password: '812005',
    database: 'simple_authentication',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: '812005',
    database: 'test_simple_authentication',
    host: '127.0.0.1',
    port: 3306,
    dialect: 'mysql'
  },
  production: {
    username: process.env.DB_PRODUCTION_USERNAME,
    password: process.env.DB_PRODUCTION_PASSWORD,
    database: process.env.DB_PRODUCTION_NAME,
    host: process.env.DB_PRODUCTION_HOST,
    port: 3306,
    dialect: 'mysql'
  }
}