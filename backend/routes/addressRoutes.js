const express =require('express')
const router= express.Router()
// const {registerUser, loginUser, getMe}= require('../controllers/userController')
const {postAddress, getAddress, deleteAddress}= require('../controllers/addressController')
const {protectUser}= require('../middleware/authMiddlewareUser')

router.post('/',protectUser, postAddress)
router.put('/:id',protectUser, deleteAddress)
router.get('/',protectUser, getAddress)
// router.put('/:id',protect, updateStore)
// router.put('/delete/:id',protect, deleteStore)
// router.get('/', protect, getVendorStore)
// router.get('/allStore',  getAllStore)
// router.get('/singleStore/:id',  getSingleStore)
// router.get('/me', protect, getMe)


module.exports= router