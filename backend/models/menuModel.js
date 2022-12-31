const mongoose = require("mongoose");

const menuSchema = mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    date: {
      type: Date,
      required: [true, "please add menu date"],
    },
    menuItems: {
      type: [{foodId: String, foodName: String, _id:false}],
      required: [true, "please add menu items"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Menu", menuSchema);
