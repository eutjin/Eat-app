const asyncHandler = require("express-async-handler");

const Vendor = require("../models/vendorModel");
const Store = require("../models/storeModel");

//
const registerStore = asyncHandler(async (req, res) => {
  const {
    storeName,
    storeAddress,
    storeHours,
    storeFee,
    storePhone,
    storeCoordinate,
    storeContent,
    menuItem,
    date,
  } = req.body;
  console.log("reqbody", req.body.storeCoordinate);
  if (!req.vendor) {
    res.status(401);
    throw new Error("Vendor not found");
  }

  if (!storeName || !storeAddress || !storeHours || !storeFee || !storePhone) {
    res.status(400);
    throw new Error("store registration input error. please fill all fields");
  }

  const store = await Store.create({
    storeOwner: req.vendor._id,
    storeName,
    storeAddress,
    storeHours,
    storeFee,
    storePhone,
    storeCoordinate: { lng: storeCoordinate.La, lat: storeCoordinate.Ma },
    active: true,
    storeRatingVal: 0,
    storeRatingQty: 0,
  });
  res.status(200).json({ success: true, store });
});

//
const updateStore = asyncHandler(async (req, res) => {
  // if(!req.params.id){
  //     res.status(400)
  //     throw new Error('Please provide store ID')
  // }
  if (!req.vendor) {
    res.status(401);
    throw new Error("Vendor not found");
  }

  const store = await Store.findById(req.params.id);

  if (!store) {
    res.status(400);
    throw new Error("Store not found");
  }
  console.log("storeowner", store.storeOwner.toString());
  if (store.storeOwner.toString() != req.vendor.id) {
    res.status(401);
    throw new Error("Store does not belong to vendor");
  }
  console.log("type1", req.vendor.id);
  console.log("type2", req.vendor._id);

  const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({ success: true, updatedStore });
});

//
const deleteStore = asyncHandler(async (req, res) => {
  if (!req.vendor) {
    res.status(401);
    throw new Error("Vendor not found");
  }
  const store = await Store.findById(req.params.id);
  if (!store) {
    res.status(400);
    throw new Error("Store not found");
  }
  if (store.storeOwner.toString() != req.vendor.id) {
    res.status(401);
    throw new Error("Store does not belong to vendor");
  }
  const updatedStore = await Store.findByIdAndUpdate(req.params.id, {
    active: false,
  });
  res.status(200).json(updatedStore);
});

//
const getVendorStore = asyncHandler(async (req, res) => {
  if (!req.vendor) {
    res.status(401);
    throw new Error("Vendor not found");
  }
  const store = await Store.find({ storeOwner: req.vendor.id });
  res.status(200).json(store);
});

const getSingleStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) {
    res.status(401);
    throw new Error("Store not found");
  }
  res.status(200).json({ success: true, store });
});

//
const getAllStore = asyncHandler(async (req, res) => {
  const store = await Store.find();
  res.status(200).json(store);
});

module.exports = {
  registerStore,
  updateStore,
  deleteStore,
  getVendorStore,
  getAllStore,
  getSingleStore,
};
