const { default: mongoose, Schema } = require("mongoose")
const { CartItemSchema } = require("./CartItem")


const completedOrderSchema = new mongoose.Schema({
    cartItems: [CartItemSchema],

    tran_id: {
        type: String,
        unique: true,
    }, 

    address: {
        phone: String,
        address1: String,
        address2: String,
        city: String,
        state: String,
        postcode: Number,
        country: String,    

    },

    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Completed']
    },

    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    sessionKey: String,

},{timestamps: true})


const CompletedOrder = mongoose.model('CompletedOrder', completedOrderSchema)

module.exports = CompletedOrder
