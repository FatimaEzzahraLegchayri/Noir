import bcryptjs from 'bcryptjs'

import {User} from '../Models/user.model.js'
import { generateCode } from '../Utils/Generate.code.js';
import {generateTokenAndSetCookie} from '../Utils/generateTokenAndSetCookie.js'
import {sendVerificationEmail, sendWelcomeEmail} from '../Mailtrap/emails.js'

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
        const verificationToken = generateCode()

        const user = new User({
            email,
            name,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24h
        })
        await user.save()

        generateTokenAndSetCookie(res, user._id)
        await sendVerificationEmail(user.email, verificationToken)

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
    res.clearCookie('authToken')
    return res.status(200).json({success: true, message: 'Loged out successfuly'})
}

export const verifyEmail = async (req,res) =>{
    const {code} = req.body
    console.log('req.body', req.body)
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })
        if(!user){
            return res.status(400).json({success: false, message: 'Invalid or Expired verification code'})
        }
        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()

        await sendWelcomeEmail(user.email, user.name)
        return res.status(200).json({
            success: true, 
            message:'Email Verified Successfuly',
            user:{
                ...user._doc,
                password:undefined
            }
        })
    } catch (error) {
        console.log('error verifying email', error );
        return res.status(500).json({success:false, message: 'server error'})
        
    }

}