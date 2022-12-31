const mongoose=require('mongoose')

const storeSchema= mongoose.Schema({
    storeOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
    },
    storeName:{
        type: String,
    },
    storeAddress:{
        type: String,
    },
    storeHours:{
        type: String,
    }, 
    storeFee:{
        type: String,
    },
    storePhone:{
        type: String,
    },
    storeCoordinate:{
      lng:{type:Number}, lat:{type:Number}
    },
    active: {type: Boolean},
    storeMenu:{type: [{foodId: String, foodName: String, _id:false}]},
    // storeMenu:[{type: String}],
    // storeMenu:[{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'}],
    storeRatingVal:{
        type: Number,
    },
    storeRatingQty:{
        type: Number,
    },

},{
    timestamps: true
})

module.exports=mongoose.model('Store', storeSchema)