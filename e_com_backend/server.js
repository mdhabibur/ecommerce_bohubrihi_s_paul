const mongoose = require('mongoose')
const app = require('./app')
require('dotenv').config()


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then( () => {
    console.log("connect to mongodb successfully")
}).catch((err) => {
    console.error("error connecting to mongodb", err)
})


const port = process.env.PORT || 3001
app.listen(port, () => {
    if(port === 3001){
        console.log(`Server is running on localhost:${port}`);

    }else {
        console.log(`Server is running on live server on port:${port}`);

    }

})