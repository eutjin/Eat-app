const mongoose=require('mongoose')

const vendorSchema= mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'please add firstname']
    },
    familyname:{
        type: String,
        required: [true, 'please add familyname']
    },
    email:{
        type: String,
        required: [true, 'please add email']
    },
    password:{
        type: String,
        required: [true, 'please add password']
    },
    stores:[{type: mongoose.Schema.Types.ObjectId, ref:'Store'}],
    gridView:{type: Boolean},
},{
    timestamps: true
})

module.exports=mongoose.model('Vendor', vendorSchema)