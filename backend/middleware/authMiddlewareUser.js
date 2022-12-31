const jwt= require('jsonwebtoken')
const asyncHandler= require('express-async-handler')
const User=require('../models/userModel')

const protectUser= asyncHandler(async(req,res,next)=>{
    console.log("GFFFFFF", req.headers.authorization)
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from header
            token= req.headers.authorization.split(' ')[1] //Bearer 'token',split make it into array and token is at index1 of array
            console.log("token1", token)
            // verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET) 
console.log('decoded', decoded)
            //get user from token
            req.user= await User.findById(decoded.id).select('-password') //do not show password
console.log("req.user", req.user)
            next()

        }catch(error){
                console.log("catchtoken",error)
                res.status(401)
                throw new Error(error)
                // next(error)
        }

    }

    if(!token){
        console.log("notoke")
        res.status(401)
        throw new Error('not authorized, no token')
    }

})

module.exports = {protectUser}