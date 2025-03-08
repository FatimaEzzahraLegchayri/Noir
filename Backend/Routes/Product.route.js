import express from 'express'
const router = express.Router


import { verifyToken } from '../Middelware/verifyToken'
import { 
    getAllProducts, 
    createProduct, 
    getFeaturedProducts,
    deleteProduct,
    getProductsByCategory,
    getRecommendedProducts,
    toggelFeaturedProducts,
    updateProduct
} from '../Controllers/product.controller'

router.get('/admin/products', verifyToken, adminOnly, getAllProducts) //test same function w/ 2 paths 
router.post('/admin/products/create', verifyToken, adminOnly, createProduct)
router.patch('/admin/products/update/:id', verifyToken,adminOnly, updateProduct)
router.delete('/admin/products/delete/:id', verifyToken,adminOnly, deleteProduct)
router.patch('/:id', verifyToken,adminOnly, toggelFeaturedProducts)
// router.get('/category/:category', verifyToken,adminOnly,getProductsByCategory)

router.get('/products', getAllProducts)
router.get('/featured',getFeaturedProducts)
router.get('/category/:category',getProductsByCategory)
router.get('/recommendations',getRecommendedProducts)
// router.get('/product/:id', getProductById)

export default router