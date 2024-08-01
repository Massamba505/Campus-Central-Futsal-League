const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unuathorized - No Token Provided"});
        }

        const decoded = jwt.verify(token,"ZxxWQCa3EI/yB26626Qwr1vGsRPDHv0E6JGGZUe/ho0=");
        if(!decoded){
            return res.status(401).json({error:"Unuathorized - No Token Provided"});
        }


        const user = await User.findById(decoded.userId).select("-password"); 
        if(!user){
            return res.status(401).json({error:"User not found"});
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("error at middleware protect route",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

module.exports = protectRoute