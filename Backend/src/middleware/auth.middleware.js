const userModel = require("../models/user.model")
const tokenBlackListModel = require('../models/BlackList.model')

const jwt = require("jsonwebtoken")

async function authMiddleware(req, res, next) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token",
                status: "failed"
            })
        }

        const isBlackListed =await tokenBlackListModel.findOne({token})
        if(isBlackListed){
            return res.status(401).json({
                message: "Unauthorized - No token",
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY)

        console.log("decoded",decoded)
        const user = await userModel.findById(decoded.userID).select("-password")

        console.log("User:", user);

        if (!user) {
            return res.status(401).json({
                message: "User not found",
                status: "failed"
            })
        }

        req.user = user

        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
            status: "failed"
        })
    }
}

async function systemUserMiddleware(req,res,next){ 

    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token",
                status: "failed"
            })
        }

        const isBlackListed = tokenBlackListModel.findOne({token})
        if(isBlackListed){
            return res.status(401).json({
                message: "Unauthorized - No token",
            })
        }        
    
        const decoded = jwt.verify(token, process.env.JWT_KEY)


        const user = await userModel.findById(decoded.userID).select("+systemUser")


        if (!user) {
            return res.status(401).json({
                message: "User not found",
                status: "failed"
            })
        }

        if(user.systemUser == false){
            return res.status(403).json({
                message:"Forbidden access, not a system user"
            })
        }

        req.user = user

        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token",
            status: "failed"
        })
    }

}

module.exports ={ authMiddleware , systemUserMiddleware}