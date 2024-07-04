const Joi = require('joi')
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,

    },
    price: {
        type: Number,
        required: true,
        min: 0,

    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    quantity:{
        type: Number,
        required: true,
        min:0,

    },
    photo: {
        data: Buffer,
        contentType: String,
        path:String
    }



},{timestamps: true})

//joi schema for front end validation
const joiProductSchema = Joi.object({
	name: Joi.string().min(3).max(1000),
	description: Joi.string().min(5),
	price: Joi.number().min(0),
    category: Joi.string(),
    quantity: Joi.number().min(0)


})



const Product = mongoose.model('Product', productSchema)

module.exports = {Product,joiProductSchema}