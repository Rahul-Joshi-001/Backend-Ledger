const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const emailService = require("../services/email.service")

async function userRegisterController(req, res) {
    try {
        const { email, name, password } = req.body;

        const isUserExist = await userModel.findOne({ email });

        if (isUserExist) {
            return res.status(422).json({
                message: "User already exists with this email",
                status: "failed"
            });
        }

        const user = await userModel.create({
            email,
            name,
            password
        });

        const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_KEY,
            { expiresIn: "3d" }
        );

        res.cookie("token",token)

        res.status(201).json({
            user:{
                userID:user._id,
                email:user.email,
                name:user.name
            },
            token
        });

        await emailService.sendRegistrationEmail(user.email,user.name)

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: "failed",
            error: err.message
        });
    }
}

async function userLoginController(req,res){
    const {email,password} = req.body;

    const user = await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"Email or Password is wrong"
        })
    }

    const isValidPassword = user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message:"Email or Password is wrong"
        })
    }

    const token = jwt.sign(
            { userID: user._id },
            process.env.JWT_KEY,
            { expiresIn: "3d" }
        );

        res.cookie("token",token)

        res.status(201).json({
            message:"User successfully logged in",
            user:{
                userID:user._id,
                email:user.email,
                name:user.name
            },
            token
        });
}

module.exports ={ userRegisterController , userLoginController };