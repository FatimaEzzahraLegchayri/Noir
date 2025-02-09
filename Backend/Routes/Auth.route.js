import exress from 'express'
const router = exress.Router()
import {signup, login, logout, verifyEmail} from '../Controllers/Auth.controller.js'

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)

router.post('/verify-email', verifyEmail)


export default router