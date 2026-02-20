const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SALT = bcrypt.genSaltSync(10);
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const cloudinary = require("../config/cloudinary.config");

const signUp = async (req, res) => {
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({message: "Email already exists"});
    }
     try {
        const hashedPassword = bcrypt.hashSync(password, SALT);
        const user = await User.create({fullName, email, password: hashedPassword});
        const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "1d"});
        res.cookie("jwtcookie", token, {
            httpOnly: true,
            secure: process.env.NODE_MODE === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000
        });
        const userWithoutPassword = await User.findById(user._id).select("-password");
        res.status(201).json({user: userWithoutPassword});
     } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
     }
}

const signIn = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json({message: "All fields are required"});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "User not found"});
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if(!isPasswordValid){
        return res.status(400).json({message: "Invalid password"});
    }
    const token = jwt.sign({id: user._id}, JWT_SECRET, {expiresIn: "1d"});
    res.cookie("jwtcookie", token, {
        httpOnly: true,
        secure: process.env.NODE_MODE === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
    });
    const userWithoutPassword = await User.findById(user._id).select("-password");
    res.status(200).json({user: userWithoutPassword});
}

const signOut = async (req, res) => {
 try {
    res.cookie("jwtcookie", "", {maxAge: 0});
    res.status(200).json({message: "logged out successfully"});
 }catch(error){
    console.log(error);
    res.status(500).json({message: "Internal server error while logging out"});
 } 
}
// Update User Profile FullName profilePic=we will use cloudinary to store profile picture
const updateProfile = async (req, res) => {
    try {
        //we will have 3 case 1 user only udate fullname case 2 user only update profile picture case 3 user update both fullname and profile picture
        const fullName = req.body?.fullName;
        const profilePic = req.body?.profilePic;
        const user = req.user._id;
        if(fullName && profilePic) {
            //upload fullname and profilePic to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            if(!uploadResponse){
                return res.status(500).json({message: "Failed to upload profile picture"});
            }
            const userUpdated = await User.findByIdAndUpdate(user, {fullName, profilePic: uploadResponse.secure_url}, {new: true});
            if(!userUpdated){
                return res.status(500).json({message: "Internal server error while updating profile"});
            }
            return res.status(200).json({message: "Profile updated successfully", user: userUpdated});
        } else if(fullName){
            const userUpdated = await User.findByIdAndUpdate(user, {fullName}, {new: true});
            if(!userUpdated){
                return res.status(500).json({message: "Internal server error while updating profile"});
            }
            return res.status(200).json({message: "Profile updated successfully", user: userUpdated});
        } else if(profilePic){
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            if(!uploadResponse){
                return res.status(500).json({message: "Failed to upload profile picture"});
            }
            const userUpdated = await User.findByIdAndUpdate(user, {profilePic: uploadResponse.secure_url}, {new: true});
            if(!userUpdated){
                return res.status(500).json({message: "Internal server error while updating profile"});
            }
            return res.status(200).json({message: "Profile updated successfully", user: userUpdated});
        } else {
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error while updating profile"});
    }
}

// Get all users except the logged-in user
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error while fetching users" });
    }
}

//check auth/user online
const checkAuth = async (req, res) => {
    try {
        res.status(200).json({user: req.user});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error while checking auth"});
    }
}

module.exports = {
    signUp,
    signIn,
    signOut,
    updateProfile,
    checkAuth,
    getUsers
}