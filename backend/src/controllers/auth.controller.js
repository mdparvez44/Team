import bcrypt from "bcryptjs";
import { generateTokens } from "../lib/utils.js";
import User from "../models/user.model.js";

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All files are required"});
        }
        const user = await User.findOne({email})
        if(user) return res.status(400).json({message:"Email already exists"});
        if(password.length < 6){
            return res.status(400).json({message:"Passward must me atleast 6 characters"});
        }

        // bcrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser=new User({
            fullName,
            email,
            password:hashPassword
        })

        if (newUser){
            // Generate JWT Tokens
            generateTokens(newUser._id, res);
            await newUser.save();

            res.status(201).json({message:"Signup Successfully"})
            
        } else {
            return res.status(400).json({message:"Invalid User Details"})
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal server Error"});
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if(!user){
            res.status(400).json({message:"Invalid Email"});
        }

        const ispassword = await bcrypt.compare(password, user.password);
        if(!ispassword){
            res.status(400).json({message:"Invalid Password"});
        }

        generateTokens(user._id, res);
        res.status(200).json({message:"Loggin Successfully"})
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const logout = (req, res) => {
     try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message:"Logged out successfully"});
     } catch (error) {
        console.log("Error in logout Controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
     }
}

export const updateProfile = async(req, res) => {

}