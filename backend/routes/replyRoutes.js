const express =require('express')
const router= express.Router()
// const {registerUser, loginUser, getMe}= require('../controllers/userController')
const {postReply, updateReply, getStoreReply, deleteReply}= require('../controllers/replyController')
const {protectUser}= require('../middleware/authMiddlewareUser')
const {protect}= require('../middleware/authMiddleware')

router.post('/',protect, postReply)
router.put('/:id',protect, updateReply)
router.get('/:id',getStoreReply)
router.delete('/:id', protect, deleteReply)
// router.put('/:id',protect, updateStore)
// router.put('/delete/:id',protect, deleteStore)
// router.get('/', protect, getVendorStore)
// router.get('/allStore',  getAllStore)
// router.get('/singleStore/:id',  getSingleStore)
// router.get('/me', protect, getMe)


module.exports= router