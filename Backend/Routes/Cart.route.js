import express from 'express'

import {verifyToken } from '../Middelware/verifyToken'
import {
    addToCart,
    removeAllCartProducts,
    updateQuantity,
    getCartProducts
} from '../Controllers/cart.controller'

const router = express.Router

router.get('/',verifyToken, getCartProducts)
router.post('/',verifyToken, addToCart)
router.delete('/',verifyToken, removeAllCartProducts)
router.put('/:id',verifyToken, updateQuantity)

export default router
