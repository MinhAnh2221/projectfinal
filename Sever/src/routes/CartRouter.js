const express = require("express");
const router = express.Router()
const cartController = require('../controllers/CartController');
const { authMiddleWare, authUserMiddleWare } = require("../middleware/authMiddleware");

router.post('/add-to-cart' , authUserMiddleWare ,cartController.addToCart)
router.get('/get-cart' , authUserMiddleWare ,cartController.getCart)
router.delete('/remove-item/:id' , authUserMiddleWare ,cartController.deleteItemInCart)
router.put('/update-item' , authUserMiddleWare ,cartController.updateItemInCart)


module.exports = router 