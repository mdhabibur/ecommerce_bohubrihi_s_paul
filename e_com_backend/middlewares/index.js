const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')


module.exports = (app) => {
    app.use(express.json()) //for parsing json data
    app.use(express.urlencoded({extended: true})) //for parsing url encoded data send through url
    app.use(cors())

    //serve static files from public directory
    app.use(express.static(path.join(global.__basedir, 'public')))

    console.log("middlewares working fine!!")
    if(process.env.NODE_ENV === 'development'){
        app.use(morgan('dev'))
    }
}

