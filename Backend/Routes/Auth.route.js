import exress from 'express'
const router = exress.Router()
import {
    signup, login, logout, 
    verifyEmail,
    forgetPassword,
    resetPassword
} from '../Controllers/Auth.controller.js'
import verifyToken from '../Middelware/verifyToken.js'

router.get('check-auth',verifyToken, checkAuth)

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)

router.post('/verify-email', verifyEmail)
router.post('/forget-password', forgetPassword)
router.post('/reset-password/:token', resetPassword)



export default router