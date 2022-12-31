const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewRating: {
      type: String,
    },
    reviewText: {
      type: String,
    },
    reviewImage:
      [{ type: String }],
    active: {
      type: Boolean,
    },

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
