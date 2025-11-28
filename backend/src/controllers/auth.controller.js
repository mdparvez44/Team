import bcrypt from "bcryptjs";
import { generateTokens } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({
                success: false,
                message:"All files are required"
            });
        }
        const user = await User.findOne({email});
        if(user) {
            return res.status(400).json({
                success: false,
                message:"Email already exists"
            });
        }

        if(password.length < 6){
            return res.status(400).json({
                success: false,
                message:"Passward must me atleast 6 characters"
            });
        }

        // bcrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser=new User({
            fullName,
            email,
            password:hashPassword
        });

        // Generate JWT Tokens
        generateTokens(newUser._id, res);

        return res.status(201).json({
            success: false,
            message:"Signup Successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        })
            
    } catch (error) {
        console.error("Error in signup controller", error);
        res.status(500).json({
            success: false,
            message: "Internal server Error"
        });
    }
}

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid Email"
            });
        }

        const ispassword = await bcrypt.compare(password, user.password);
        if(!ispassword){
            return res.status(401).json({
                success: false,
                message:"Invalid Password"
            });
        }

        generateTokens(user._id, res);

        return res.status(200).json({
            success: true,
            message:"Loggin Successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error in login controller", error);
        res.status(500).json({
            success: false,
            message:"Internal Server Error"
        });
    }
}

export const logout = (req, res) => {
     try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({
            success: true,
            message:"Logged out successfully"
        });

     } catch (error) {
        console.error("Error in logout Controller", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export const updateProfile = async(req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({
                success:false,
                message:"Profile pic is required"
            });
        }
        
        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "profile_pics"
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");

        return res.status(200).json({
            sucess: true,
            message: "Profile updated",
            user: updatedUser
        });

    } catch (error) {
        console.error("Error in update profile", error)
        res.status(500).json({
            success: false,
            message:"Internal server error"
        })
    }
};

export const checkAuth = (req, res)=>{
    try {
        return res.status(200).json({
            success: true,
            user: req.User
        })
    } catch (error) {
        console.error("Error in Auth", error)
        res.status(500).json({
            success: false,
            message:"Server Error"
        })
    }
}