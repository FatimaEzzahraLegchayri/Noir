import jwt from 'jsonwebtoken'
import { User } from '../Models/user.model';

export const verifyToken = async(req,res,next) =>{
    const token = req.cookies?.authToken

	if(!token) return res.status(401).json({success: false, message: 'Unauthorized - no token provided!'})
    try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		const user = await User.findById(decoded.userId).select('-password')
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}
		req.user = user;
		next();
	} catch (error) {
		console.log("Error in verifyToken middelware ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}

export const adminOnly = async(req, res, next) =>{
	try {
		if(!req.user && req.user.role !== 'admin'){
			return res.status(403).json({ success: false, message: "Access denied - Admins only!" });
		}
		next()
	} catch (error) {
		console.log("Error in adminOnly middleware", error);
        return res.status(500).json({ success: false, message: "Server error" });
	}
}