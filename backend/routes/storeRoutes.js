const express =require('express')
const router= express.Router()
// const {registerUser, loginUser, getMe}= require('../controllers/userController')
const {registerStore, updateStore, getSingleStore, deleteStore, getVendorStore, getAllStore}= require('../controllers/storeController')
const {protect}= require('../middleware/authMiddleware')

router.post('/', protect, registerStore)
router.put('/:id',protect, updateStore)
router.put('/delete/:id',protect, deleteStore)
router.get('/', protect, getVendorStore)
router.get('/allStore',  getAllStore)
router.get('/singleStore/:id',  getSingleStore)
// router.get('/me', protect, getMe)


module.exports= router