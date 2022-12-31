const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isHome: {
      type: Boolean,   
    },
    isWork: {
      type: Boolean,   
    },
    isFavourite: {
      type: Boolean,   
    },
    locationCoordinate:{
      lng:{type:Number}, lat:{type:Number}
    },
    locationAddress:{
      type: String,
    },
    
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Address", addressSchema);
