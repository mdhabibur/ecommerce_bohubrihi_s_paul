require('express-async-errors')


const asyncErrorHandler = (err, req, res, next) => {
    const status = err.status || 500
    const message = err.message || "Internal Server Error"
    console.log(err.stack) 

    res.status(status).json({
        status,
        message,
        error: process.env.NODE_ENV === 'production' ? {} : err
    })
}

module.exports = asyncErrorHandler