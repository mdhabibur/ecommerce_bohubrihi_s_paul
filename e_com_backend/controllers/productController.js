const formidable = require('formidable')
const { InternalServerError, BadRequestError } = require('../utils/errors')
const { Product } = require('../models/Product')
const fs = require('fs')
const _ = require('lodash')
const { Category } = require('../models/Category')
const { default: mongoose } = require('mongoose')

const addProduct = async (req, res, next) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
        if (err) {
        console.log(err)
        return res.status(400).json({
            error: err,
            message: 'form parsing error'
        });
        }

        const product = new Product(fields);

        if (files.photo) {
            // <input type="file" name="photo" />
            // console.log("files: ", files)
            try{
                console.log("path:", files.photo.path)

                fs.readFile(files.photo.path, async (err, bufferData) => {
                    if(err) {
                        return res.status(500).json({
                            message: 'could not read photo file',
                            error: err
                        })
                    }
                    // console.log('data: ', bufferData)
                    product.photo.data = bufferData;
                    product.photo.contentType = files.photo.type;

                    try{
                        const result = await product.save()
                        console.log("result: ", result)
    
                        return res.status(201).send({
                            message: "Product Created Successfully with photo!",
                            result: result,
                            data: _.pick(result, ["name", "description", "price", "category", "quantity"])
                        })
                    }catch(err){
                        console.log("error: ", err)
                        return res.status(400).json({
                            message: 'Problem in file creating product with photo data!',
                            error: err
                        });
                    }


                })

            }catch(err){
                console.log("error: ", err)
                return res.status(400).json({
                    message: 'Problem in file reading data!',
                    error: err
                });
            }

        } else {

            try{
                const result = await product.save()
                return res.status(201).send({
                    message: "Product Created Successfully and no photo provided!",
                    data: _.pick(result, ["name", "description", "price", "category", "quantity"])
                })

            }catch(err){
                return res.status(500).json({
                    message:"Internal Server error! no product saved",
                    error: err,
                    errMsg: err.message,
                });
            }
        }
    })


}

const getProducts = async (req, res, next) => {
    console.log(req.query)
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let order = req.query.order ? req.query.order : 'asc'
    let limit = req.query.limit ? req.query.limit : 5

    try{
        const products = await Product.find({})
                            .populate('category', 'name')
                            .sort({[sortBy] : order})
                            .limit(limit)

        return res.status(200).json({
            message: 'products list',
            products: products,
        })

    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: 'can not retrieve products list',
            error: err
        })

    }


}


const getPhoto = async (req, res, next) => {
    // console.log(req.params.id)
    const productId = req.params.id 
    //check if the provided Id is a valid MongoDb Object Id
    if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(400).json({
            message: 'Invalid product ID format'
        });
    }

    try{
       const product = await Product.findById(productId).select({photo:1, _id:0})
       console.log(product)
       res.set('Content-Type', product.photo.contentType)
       return res.status(200).send(product.photo.data)

    }catch(err){
       return res.status(500).json({
            message: 'could not retrieve product photo',
            error: err
        })
    }

}

const getProductById = async (req, res, next) => {
    const productId = req.params.id

    try{
        const product = await Product.findById(productId)
                                .select({photo:0})
                                .populate("category", 'name _id')

        return res.status(200).json({
            message: 'product retrieved successfully',
            product: product
        })

    }catch(err){

        return res.status(500).json({
            message: 'product could not be retrieved',
            error: err
        })

    }


}

const updateProductById = async (req, res, next) => {
    const productId = req.params.id

    if(!mongoose.Types.ObjectId.isValid(productId)){
        return res.status(400).json({
            message: "Invalid product Id format"
        })
    }

    const form = new formidable.IncomingForm({keepExtensions: true})

    form.parse(req, async (err, fields, files) => {
        if(err){
            return res.status(400).json({
                message: 'Error parsing the form data',
                error: err
            })
        }

        try {
            const product = await Product.findById(productId)
            const previousProduct = product.toObject()

            if(!product){
                return res.status(404).json({
                    message: "Product not found"
                })
            }

            //update product
            for(let key in fields){
                product[key] = fields[key]
            }

            //handle product photo upload
            if(files.photo){
                const photoData = fs.readFileSync(files.photo.path)
                product.photo.data = photoData
                product.photo.contentType = files.photo.type
            }

            const updatedProduct = await product.save()

            return res.status(200).json({
                message: 'product updated',
                previousProduct: previousProduct,
                updatedProduct: updatedProduct,
            })

        } catch (error) {
            return res.status(200).json({
                message: 'product could not be updated',
                error: err
            })

            
        }



    })



}

//user given req body would be like this:
/*

const body = {
order: 'desc',
sortBy: 'price',
limit: 5,
skip: 5,

filters: {
price: [0, 1000],
category: ['666f47b10da508e1cb21d411', '666f47b10da508e1cb21d411', '666f46f132484ff2bcda3b98']

 }
}

so for filters object, the query would be like this:
for price: {price: {$gte: 0, $lte: 1000}}
for category: {category: {$in: ['c11', 'c12', 'c13']}}


*/

const filterProducts = async (req, res, next) => {

    let sortBy = req.body.sortBy ? req.body.sortBy : "_id"
    let order = req.body.order ? req.body.order : 'desc'
    let limit = req.body.limit ? parseInt(req.body.limit) : 10
    let skip = req.body.skip ? parseInt(req.body.skip) : 0
    let filters = req.body.filters

    let args = {}


    for (let key in filters){
        if(filters[key].length > 0){

            if(key === 'price'){
                args[key] = {
                    $gte: filters[key][0],
                    $lte: filters[key][1]
                }
            }
            if(key === 'category'){
                args[key] = {
                    $in: filters[key]
                }
            }

            console.log("args", args)

        }

    }

    const product = await Product.find(args)
                        .select({photo: 0})
                        .populate('category', 'name')
                        .sort({[sortBy] : order})
                        .limit(limit)
                        .skip(skip)


    res.status(200).json({
        message: "product filtered",
        product: product
    })                    


    
}



module.exports = {
    addProduct,
    getProducts,
    getPhoto,
    getProductById,
    updateProductById,
    filterProducts
}