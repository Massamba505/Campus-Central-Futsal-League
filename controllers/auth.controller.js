const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const genrateTokenAndSetCookie = require("../util/generateToken");

const login = async(req,res) =>{
    try {
        const {username,password} = req.body;
        // Validate input data
        console.log(username,password)
        if (!username || !password ) {
            return res.status(400).json({ error: "All details are required" });
        }

        const findUser = await User.findOne({username});

        const isPasswordCorrect = await bcrypt.compare(password,findUser?.password || "");
        if(!findUser || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid username or password"});
        }

        genrateTokenAndSetCookie(findUser._id,res);

        res.status(201).json({
            // _id:findUser._id,
            username
        });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}

const signup = async (req, res) => {
    try {

        const { username, password} = req.body;
        console.log(req.body);

        // Validate input data
        if (!username || !password ) {
            return res.status(400).json({ error: "All details are required" });
        }

        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ error: "username is already registered" });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        genrateTokenAndSetCookie(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            username
        });

    } catch (error) {
        // Log the error for debugging
        console.error("Error in signup controller:", error.message);

        // Respond with generic error message
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const logout = async(req,res) =>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({error:"Internal Server Error"});
    }
}


const logined = async(req,res) =>{
   
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"Unuathorized - No Token Provided"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"Unuathorized - No Token Provided"});
        }


        const user = await User.findById(decoded.userId).select("-password"); 
        if(!user){
            return res.status(401).json({error:"User not found"});
        }

        req.user = user;
        res.status(200).json({message:"logged in"});

    } catch (error) {
        console.log("error at middleware protect route",error.message);
        res.status(500).json({error:"Internal server error"});
    }
}

module.exports = {
    login,
    signup,
    logout,
    logined
}