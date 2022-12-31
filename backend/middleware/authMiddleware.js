const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Vendor = require("../models/vendorModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    console.log("123")
    try {
      //get token from header
      token = req.headers.authorization.split(" ")[1]; //Bearer 'token',split make it into array and token is at index1 of array

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   console.log("decoded", decoded);
      //get user from token
      req.vendor = await Vendor.findById(decoded.id).select("-password"); //do not show password
      console.log("req.vendor", req.vendor);
      next();
    } catch (error) {
      console.log("catchtoken", error);
      res.status(401);
      throw new Error(error);
      // next(error)
    }
  }
  else{
    
  }
//   console.log("token", token);
  if (!token) {
    res.status(401);
    throw new Error("not authorized, no token");
  }
});

module.exports = { protect };
