const express =require('express')
const router= express.Router()
// const {registerUser, loginUser, getMe}= require('../controllers/userController')
const {registerUser, loginUser, getUser, setUserFavourite, unsetUserFavourite}= require('../controllers/userController')
const {protect}= require('../middleware/authMiddleware')
const {protectUser}= require('../middleware/authMiddlewareUser')

router.post('/register', registerUser)
router.post('/login',loginUser)
router.get('/me', protect, getUser)
router.post('/favourite/:id', protectUser, setUserFavourite)
router.post('/unfavourite/:id', protectUser, unsetUserFavourite)

module.exports= router