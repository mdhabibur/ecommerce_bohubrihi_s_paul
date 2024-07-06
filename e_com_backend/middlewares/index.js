const express = require('express')
const cors = require('cors')
const morgan = require('morgan')


module.exports = (app) => {
    app.use(express.json()) //for parsing json data
    app.use(express.urlencoded({extended: true})) //for parsing url encoded data send through url
    app.use(cors())
    console.log("middlewares working fine!!")
    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'))
    }
}

