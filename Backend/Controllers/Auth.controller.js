import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

import {User} from '../Models/user.model.js'
import { generateCode } from '../Utils/Generate.code.js';
import {generateTokenAndSetCookie} from '../Utils/generateTokenAndSetCookie.js'
import {
    sendVerificationEmail, 
    sendWelcomeEmail, 
    sentResetPasswordEmail,
    sentResetSuccessEmail
} from '../Mailtrap/emails.js'

export const signup = async (req,res) =>{
    const { name, email, password } = req.body;
    try {
        if(!email || !name || !password){
            return res.status(400).json({success: false, message: 'All fields are required.'})
        }
        const isEmailExist = await User.findOne({email})
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

export const login = async (req,res) =>{
    const {email, password} = req.body
    try {
        if(!email || !password){
            return res.status(400).json({success: false, message: 'All fields are required.'})
        }
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({success: false, message: 'Invalid email.'})
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if(!isPasswordValid) return res.status(400).json({success: false, message:"Invalid Password"})
    
        generateTokenAndSetCookie(res, user._id)
        // console.log('res, user._id ..........', user._id)
        user.lastLogin = new Date()
        await user.save()

        return res.status(200).json({
            success: true,
            message:'Loged in successfyly.',
            user:{
                ...user._doc,
                password: undefined
            }
        })

    } catch (error) {
        console.log('error in loging ', error);
        
        return res.status(500).json({success: false, message: error.message})
        
    }
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

export const forgetPassword = async (req,res) =>{
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({success:false, message: 'Incorrect email, please try again'})
    
        const resetToken = crypto.randomBytes(20).toString('hex')
        const resetTokenExpiredAt = Date.now() + 1 * 60 * 60 * 1000 //1h
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiresAt = resetTokenExpiredAt

        await user.save();
        await sentResetPasswordEmail(email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`) //sent email to reset password
        return res.status(200).json({success: true, message: 'Password reset link sent to your email'})

    } catch (error) {
        console.log('error in forget password', error);
        return res.status(500).json({success: false, message: error})
    }
}

export const resetPassword = async (req,res) =>{
    const {token} = req.params
    const {password} = req.body
    console.log('token', token, password)
    try {

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: {$gt: Date.now()}
        })
        
        if(!user) return res.status(400).json({success: false, message: 'Invalide or Expired token'})

        const hashedPassword = await bcryptjs.hash(password, 10)
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined
        user.resetPasswordExpiresAt = undefined

        await user.save()
        await sentResetSuccessEmail(user.email)
        return res.status(200).json({success:true, message: 'Password reset successfuly'})
    } catch (error) {
        console.log('error in reset password', error);
        return res.status(500).json({success: false, message: error})
    }
}

export const checkAuth = async (req, res) => {
    try {
		if (!req.user) {
            return res.status(400).json({ success: false, message: "Invalid request - No user data found" });
        }

		return res.status(200).json({ success: true, user: req.user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		return res.status(400).json({ success: false, message: error.message });
	}
};