const asyncHandler = require("express-async-handler");
const Address = require("../models/addressModel");
const Store = require("../models/storeModel");
//
const postAddress= asyncHandler(async(req,res)=>{
console.log("address", req.body)
const {locationCoordinate, locationAddress}= req.body



const address= await Address.create({
  userId: req.user._id, isHome: false, isWork: false, isFavourite: false, locationCoordinate:{lng: locationCoordinate.lng, lat: locationCoordinate.lat }, locationAddress
})
res.status(200).json({success: true,address})
})

const getAddress= asyncHandler(async(req,res)=>{
  const address= await Address.find({userId: req.user._id })
  console.log("getAddress", address)
  res.status(200).json({ success: true,address });
  })

  const deleteAddress= asyncHandler(async(req,res)=>{
  
  })

module.exports = {
  postAddress, getAddress, deleteAddress
};
