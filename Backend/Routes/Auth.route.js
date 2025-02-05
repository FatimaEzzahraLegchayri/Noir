import exress from 'express'
const router = exress.Router()
import {signup, login, logout} from '../Controllers/Auth.controller.js'

router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)




export default router