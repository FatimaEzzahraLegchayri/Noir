import bcryptjs from 'bcryptjs'

import {User} from '../Models/user.model.js'
import { generateCode } from '../Utils/Generate.code.js';
import {generateTokenAndSetCookie} from '../Utils/generateTokenAndSetCookie.js'

export const signup = async (req,res) =>{
    const { name, email, password } = req.body;
    console.log('req.body back ...', req.body)
    try {
        if(!email || !name || !password){
            return res.status(400).json({success: false, message: 'All fields are required.'})
        }
        const isEmailExist = await User.findOne({email})
        console.log('isEmailExist', isEmailExist)
        if(isEmailExist){
            return res.status(400).json({success: false, message: 'Email already in use.'})
        }
        const hashedPassword = await bcryptjs.hash(password,10)
        const verificationCode = generateCode()

        const user = new User({
            email,
            name,
            password: hashedPassword,
            verificationToken: verificationCode,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24h
        })
        await user.save()

        generateTokenAndSetCookie(res, user._id)
        return res.status(200).json({
            success:true,
            message: 'User created successfully',
            user:{
                ...user._doc,
                password: undefined
            }
        })
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }

}

export const login = (req,res) =>{

}

export const logout = (req,res) =>{

}