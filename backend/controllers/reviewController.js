const asyncHandler=require('express-async-handler')
const Menu=require('../models/menuModel')
const Store=require('../models/storeModel')
const Review= require('../models/reviewModel')

//
const postReview=asyncHandler(async(req,res)=>{
    console.log("www",req.body)
    const {reviewRating, reviewImage, reviewText}= req.body

    if(!reviewRating||!reviewText){
        res.status(400)
        throw new Error('review registration error. provide message and rating!')
    }
    

    const review= await Review.create({
        storeId: req.params.id, userId: req.user._id, active:true, reviewImage, reviewRating, reviewText
    })

    const store= await Store.find({_id: req.params.id})
    console.log("store", store[0])
    if(store[0].storeRatingQty==0){
        console.log("haa")
        const updatedStore= await Store.findByIdAndUpdate(req.params.id,  {storeRatingQty:1, storeRatingVal: reviewRating })
    }else{
        const newRatingQty= await store[0].storeRatingQty+1
        const prevTotalRatingVal= await store[0].storeRatingQty * store[0].storeRatingVal
        const newRatingVal= await ((prevTotalRatingVal + reviewRating)/newRatingQty)
        console.log("new", newRatingQty, newRatingVal)
        const updatedStore= await Store.findByIdAndUpdate(req.params.id,  {storeRatingQty:newRatingQty, storeRatingVal: newRatingVal })
    }

    res.status(200).json({success: true,review})
})

const updateReview= asyncHandler(async(req,res)=>{
    // await Review.findByIdAndUpdate(req.params.id, req.body).exec((err, review)=>{
    //     if(err) return res.json({success: false, err})
    //     console.log("updatereview", review)
    //     res.status(200).json({success: true, review})
    //    })

    const review= await Review.findByIdAndUpdate(req.params.id, req.body)
      console.log("123", review)
       const allStoreReviews= await Review.find({storeId:review.storeId})
       console.log("pre", allStoreReviews)
       let totalRatingValue= await  allStoreReviews.reduce((total, item)=>{
        const {reviewRating}=item
        

        total=total+parseInt(reviewRating)
        
return total
       }, 0)
       const newRatingValue= await totalRatingValue/allStoreReviews.length
       console.log("finale", newRatingValue)
       const updatedStore= await Store.findByIdAndUpdate(review.storeId,  {storeRatingQty:allStoreReviews.length, storeRatingVal: newRatingValue })
       res.status(200).json({success: true, review})
})

const getStoreReview=asyncHandler(async(req, res)=>{
    const review= await Review.find({storeId:req.params.id}).populate({path: 'userId', select: 'familyname firstname '})
    // console.log("review", review)
    res.status(200).json({success: true, review})
})

module.exports={
    postReview, getStoreReview, updateReview
}