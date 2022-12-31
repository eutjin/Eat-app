const jwt= require('jsonwebtoken')
const bcrypt= require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Vendor=require('../models/vendorModel')

//@@@ register vendor @@@
const registerVendor=asyncHandler(async(req,res)=>{
    const {firstname, familyname, email, password}= req.body

    if(!firstname||!familyname||!email||!password){
        res.status(400)
        throw new Error('registration input error. please fill all fields')
    }

    //check if user exist
    const vendorExists= await Vendor.findOne({email})

    if(vendorExists){
        res.status(400)
        throw new Error('vendor already exists')
    }


     // hash password
     const salt=await bcrypt.genSalt(10)
     const hashedPassword= await bcrypt.hash(password, salt)

    const vendor=await Vendor.create({
        firstname, familyname, email, password: hashedPassword,gridView: true
    })

    if(vendor){
        res.status(201).json({
            _id: vendor.id,
            firstname: vendor.firstname,
            familyname: vendor.familyname,
            email: vendor.email,
            token: generateToken(vendor._id),
            gridView: vendor.gridView,
        })
    }else{
        res.status(400)
        throw new Error('invalid user data')
    }

  
})


// @@@ login venndor @@@
const loginVendor=asyncHandler(async(req,res)=>{
    const {email, password}= req.body
    const vendor=await Vendor.findOne({email})
    if(vendor && (await bcrypt.compare(password, vendor.password))){
        res.json({
            _id: vendor.id,
            firstname: vendor.firstname,
            familyname: vendor.familyname,
            email: vendor.email,
            token: generateToken(vendor._id),
            gridView: vendor.gridView,
        })
    }else{
        res.status(400)
        throw new Error('invalid password')
    }
})

//@@@
const getVendor= asyncHandler(async(req,res)=>{
    
    res.status(200).json(req.vendor)
})

//@@@
const preferenceVendor=asyncHandler(async(req, res)=>{
    console.log("xxx", req.vendor._id, req.body)
    const updatedVendor=await Vendor.findByIdAndUpdate(req.vendor._id, {gridView: req.body.gridView}, {new: true})
    console.log("updateVendor", updatedVendor)
    res.status(200).json({success:true, updatedVendor})
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
module.exports={
    registerVendor, loginVendor, getVendor, preferenceVendor
}