const {Category} = require("../models/Category")
const _ = require('lodash')

const createCategory = async (req, res) => {
    try{
        const {name} = req.body
        const category = new Category({name})
        const result = await category.save()
        res.status(201).json({
            message: "new category created",
            data: _.pick(result, ["_id", "name"])
        })

    }catch(err){
        res.status(500).json({
            message: "category not created",
        })
    }
}


const getCategories = async (req, res) => {
    try{
        const categories = await Category.find()
                                    .select({
                                        _id:1,
                                        name: 1
                                    })
                                    .sort({
                                        name:1
                                    })
        res.status(200).json(categories)
    }catch(err){
        res.status(500).json({
            message: "failed to get categories"
        })
    }

}

module.exports = {
    createCategory,
    getCategories
}