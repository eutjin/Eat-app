const mongoose=require('mongoose')

const userSchema= mongoose.Schema({
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
    review:[{type: mongoose.Schema.Types.ObjectId, ref:'Review'}],
    favourites:[{type: mongoose.Schema.Types.ObjectId, ref:'Store'}],
},{
    timestamps: true
})

module.exports=mongoose.model('User', userSchema)