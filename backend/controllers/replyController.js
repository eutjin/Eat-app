const asyncHandler = require("express-async-handler");

const Store = require("../models/storeModel");
const Review = require("../models/reviewModel");
const Reply = require("../models/replyModel");

//
const postReply = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.body.storeId);
  console.log("stoe", store)
  if (!store) {
    res.status(400);
    throw new Error("store not found");
  }

  const reply = await Reply.create({
    storeId: req.body.storeId,
    vendorId: req.vendor._id,
    reviewId: req.body.reviewId,
    replyText: req.body.replyText,
  });
  res.status(200).json({ success: true, reply });
});

//
const updateReply = asyncHandler(async (req, res) => {
  console.log("UPDATE REPLY",req.body)
  await Reply.findByIdAndUpdate(req.params.id, {replyText: req.body.replyText}).exec((err, reply) => {
    if (err) return res.json({ success: false, err });
    console.log("UPDATE");
    res.status(200).json({ success: true, reply });
  });
});

//
const getStoreReply = asyncHandler(async (req, res) => {
    console.log("norae", req.params)
  const reply = await Reply.find({ storeId: req.params.id });
  console.log("getReply", reply);
  if (reply.length > 0) {
    res.status(200).json({ success: true, reply });
  } else {
    res.status(200).json({ success: false, reply });
  }
});

const deleteReply = asyncHandler(async (req, res) => {

    if (!req.vendor) {
        res.status(400);
        throw new Error("not vendor");
      }
      const reply= await Reply.deleteOne({_id: req.params.id})
      console.log("delete", reply)
      if(reply.acknowledged){
        res.status(200).json({ success: true});
      }
});

//

module.exports = {
  postReply,
  updateReply,
  getStoreReply,deleteReply
};
