const userModel = require("../models/user.model")
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

        const decoded = jwt.verify(token, process.env.JWT_KEY)

        const user = await userModel.findById(decoded.userID).select("-password")

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

module.exports ={ authMiddleware}