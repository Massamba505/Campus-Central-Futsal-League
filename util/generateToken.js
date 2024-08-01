const jwt = require("jsonwebtoken");

const genrateTokenAndSetCookie = (userId, res)=>{
    const token = jwt.sign({userId},"ZxxWQCa3EI/yB26626Qwr1vGsRPDHv0E6JGGZUe/ho0=",{
        expiresIn: '15d'
    });

    res.cookie("jwt",  token,{
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite:"strict",
        // secure:process.env.NODE_ENV != "development"
    });
}

module.exports = genrateTokenAndSetCookie;