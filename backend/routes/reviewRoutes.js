const express =require('express')
const router= express.Router()
// const {registerUser, loginUser, getMe}= require('../controllers/userController')
const {postReview, getStoreReview, updateReview}= require('../controllers/reviewController')
const {protectUser}= require('../middleware/authMiddlewareUser')

router.post('/:id',protectUser, postReview)
router.put('/:id',protectUser, updateReview)
router.get('/:id',getStoreReview)
// router.put('/:id',protect, updateStore)
// router.put('/delete/:id',protect, deleteStore)
// router.get('/', protect, getVendorStore)
// router.get('/allStore',  getAllStore)
// router.get('/singleStore/:id',  getSingleStore)
// router.get('/me', protect, getMe)


module.exports= router