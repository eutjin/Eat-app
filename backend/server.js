const express = require('express')
const colors=require('colors')
const dotenv = require('dotenv').config()
const {errorHandler}= require('./middleware/errorMiddleware')
const  connectDB=require('./config/db')
const cors = require("cors");
const path= require("path");

const port=process.env.PORT || 5000


connectDB()

const app =express()
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/vendor', require('./routes/vendorRoutes'))
app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/menu', require('./routes/menuRoutes'))
app.use('/api/store', require('./routes/storeRoutes'))
app.use('/api/review', require('./routes/reviewRoutes'))
app.use('/api/reply', require('./routes/replyRoutes'))
app.use('/api/address', require('./routes/addressRoutes'))

app.use(errorHandler)

if(process.env.NODE_ENV==='production'){
    console.log("production")
    app.use(express.static(path.join('../frontend/build')))

    app.get('*', (req,res)=>res.sendFile(path.resolve('frontend', 'build', 'index.html')))

}
else{
    console.log("not productin")
    app.get('/', (req,res)=>res.send('set!'))
}

app.listen(port, ()=>console.log(`server started one port ${port}`))