const {User} = require("../models/User")
const _ = require('lodash')
const bcrypt = require('bcrypt'); 



const signup = async (req, res) => {

    const isAlreadyRegistered = await User.findOne({email: req.body.email})


    try {
        const {name, email, password, role} = req.body
        const newUser = new User({name, email, password, role})

        // const isAlreadyRegistered = await User.findOne({email: req.body.email})

        if(isAlreadyRegistered) return res.status(400).json({
            message: "User already registered"
        })

        const result = await newUser.save()
        const token = newUser.generateJWT()

        res.status(201).json({
            message: "User registration successful",
            token: token,
            user: _.pick(result, ["_id", "name", "email"])
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "error registering new user", error
        })
    }
}

const signin = async (req, res) => {
    try{
        const {email, password} = req.body
        const user = await User.findOne({email: email})
        if(!user) return res.status(500).json({
            message: "no user found"
        })


        const isCorrectPassword = await bcrypt.compare(password, user.password)
        console.log("db password: ", user.password , "given pass: ", password)
        console.log("doesMatch:" , isCorrectPassword)
        if(!isCorrectPassword) return res.status(500).json({
            message: "invalid email or password"
        })

        const token = user.generateJWT()
        res.status(201).json({
            message: "User login successful",
            token: token,
            user: _.pick(user, ["email"])
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            message: "error Login user",
            error
        })

    }

}

module.exports = {signup, signin}