const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SALT = bcrypt.genSaltSync(10);
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

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
        res.status(201).json({user});
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
    const token = jwt.sign({id: user._id}, JWT_SECRET);
    res.cookie("jwtcookie", token);
    res.status(200).json({user});
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

module.exports = {
    signUp,
    signIn,
    signOut
}