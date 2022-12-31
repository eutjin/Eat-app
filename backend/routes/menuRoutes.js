const express =require('express')
const router= express.Router()
// const {registerUser, loginUser, getMe}= require('../controllers/userController')
const {setMenu, getAllMenu, updateMenu, getDayMenu, deleteMenu, searchMenu, deletePastMenu}= require('../controllers/menuController')
const {protect}= require('../middleware/authMiddleware')

router.post('/', protect, setMenu)
router.post('/delPastMenu', deletePastMenu)
router.get('/:id', getAllMenu)
router.post('/search', searchMenu)
router.post('/day/:id', getDayMenu)
router.put('/:id',protect, updateMenu)
router.delete('/:id', protect, deleteMenu)


module.exports= router