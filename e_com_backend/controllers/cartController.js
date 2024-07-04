const { CartItem } = require("../models/CartItem")


const createCartItem = async (req, res) => {
    let {price, product} = req.body 

    const item = await CartItem.findOne({
        user: req.user._id,
        product: product

    })

    if(item) return res.status(400).send({
        message: 'Item already exists in cart'
    })
    
    //default count: 1
    let cartItem = new CartItem({price, product, user: req.user._id})
    
    const result = await cartItem.save()
    res.status(201).send({
        message: "Added to cart successfully!",
        data: result,
        requestObj: req.user
    });

}

const getCartItem = async (req, res) => {
    const cartItems = await CartItem.find({
        user: req.user._id
    }) 
    .populate('product')
    .populate('user', ['name', 'email'])

    return res.status(200).send(cartItems)
    

}


const updateCartItem = async (req, res) => {
    //update previous count by one 
    const {_id, count, price} = req.body
    userId = req.user._id
    const updatedItem = await CartItem.updateOne({_id: _id, user: userId}, {price: price, count: count})

    return res.status(200).send({
        message: 'cart item updated',
        updatedItem : updatedItem
    })



}


const deleteCartItem = async (req, res) => {
    const _id = req.params.id 
    userId = req.user._id

    const deletedCartItem = await CartItem.deleteOne({_id:_id, user: userId})

    return res.status(200).send({
        message: "cart item deleted",
        deletedCartItem: deletedCartItem
    })
}


module.exports = {
    createCartItem,
    getCartItem,
    updateCartItem,
    deleteCartItem

}