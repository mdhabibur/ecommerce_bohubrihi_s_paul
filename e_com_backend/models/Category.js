const Joi = require('joi')
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    }
}, {timestamps: true})

//joi schema
const joiCategorySchema = Joi.object({
	name: Joi.string().min(3).max(100).required(),

})

const Category = mongoose.model('Category', categorySchema)

module.exports = {Category, joiCategorySchema}