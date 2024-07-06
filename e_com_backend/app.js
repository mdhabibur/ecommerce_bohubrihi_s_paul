const express = require('express')
require('express-async-errors')
const cors = require('cors')
const morgan = require('morgan')

const asyncErrorHandler = require('./middlewares/asyncErrorHandler')


require('dotenv').config()
const app = express()

//got the root dir and set it to global
global.__basedir = path.resolve(__dirname)


//using middlewares
const middlewares = require('./middlewares/index')
middlewares(app)
console.log("middleware:", middlewares)

//routes
const routes = require('./router/router')
routes(app)

console.log("router:", routes)

//Promise rejection error handler middleware
app.use(asyncErrorHandler)
module.exports = app