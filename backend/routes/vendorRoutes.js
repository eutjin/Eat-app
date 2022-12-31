const express =require('express')
const router= express.Router()
// const {registerUser, loginUser, getMe}= require('../controllers/userController')
const {registerVendor, loginVendor, getVendor, preferenceVendor}= require('../controllers/vendorController')
const {protect}= require('../middleware/authMiddleware')

router.post('/register', registerVendor)
router.post('/login',loginVendor)
router.get('/me', protect, getVendor)
router.post('/preference',protect, preferenceVendor)


module.exports= router