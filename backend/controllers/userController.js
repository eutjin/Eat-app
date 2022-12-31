const jwt= require('jsonwebtoken')
const bcrypt= require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User=require('../models/userModel')

//@@@ register user @@@
const registerUser=asyncHandler(async(req,res)=>{
    const {firstname, familyname, email, password}= req.body

    if(!firstname||!familyname||!email||!password){
        res.status(400)
        throw new Error('registration input error. please fill all fields')
    }

    //check if user exist
    const userExists= await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error('user already exists')
    }

     // hash password
     const salt=await bcrypt.genSalt(10)
     const hashedPassword= await bcrypt.hash(password, salt)

    const user=await User.create({
        firstname, familyname, email, password: hashedPassword,
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            firstname: user.firstname,
            familyname: user.familyname,
            email: user.email,
            favourites: user.favourites,
            token: generateToken(user._id),
        })
    }else{
        res.status(400)
        throw new Error('invalid user data')
    }
})


// @@@ login vendor @@@
const loginUser=asyncHandler(async(req,res)=>{
    const {email, password}= req.body
    const user=await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user.id,
            firstname: user.firstname,
            familyname: user.familyname,
            email: user.email,
            favourites: user.favourites,
            token: generateToken(user._id),
        })
    }else{
        res.status(400)
        throw new Error('invalid password')
    }
})

//@@@
const getUser= asyncHandler(async(req,res)=>{
    
    res.status(200).json(req.user)
})

//@@@ generate JWT token @@@ 
const generateToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '1d',
    })
}


// const generateToken=(id)=>{
//     return jwt.sign({id}, process.env.JWT_SECRET,{
//         expiresIn: '1d',
//     })
// }

const setUserFavourite=asyncHandler(async(req, res)=>{
console.log("hip")
    const user=await User.findByIdAndUpdate(req.user._id, {$push: {favourites: req.params.id}}, {new:true}).select("-password -createdAt -updatedAt -__v")
console.log("myUser", user)
    res.status(200).json({success: true, user })
})

const unsetUserFavourite=asyncHandler(async(req, res)=>{
    console.log("hip")
        const user=await User.findByIdAndUpdate(req.user._id, {$pull: {favourites: req.params.id}}, {new:true}).select("-password -createdAt -updatedAt -__v")
    console.log("myUser2", user)
        res.status(200).json({success: true, user })
    })
module.exports={
    registerUser, loginUser, getUser, setUserFavourite, unsetUserFavourite,
}