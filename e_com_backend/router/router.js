const userRouter = require('./userRouter')
const categoryRouter = require('./categoryRouter')
const productRouter = require('./productRouter')
const cartRouter = require('./cartRouter')
const profileRouter = require('./profileRouter')


const routes = (app) => {
    app.use('/api/users', userRouter)
    app.use('/api/category', categoryRouter)
    app.use('/api/product', productRouter)
    app.use('/api/cart', cartRouter)
    app.use('/api/profile', profileRouter)

}

module.exports = routes

