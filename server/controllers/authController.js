const bcrypt =require('bcryptjs');
const jwt=require('jsonwebtoken');
require("dotenv").config();

const User=require('../models/Users');
const JWT_SECRET=process.env.JWT_SECRET;

// Register
exports.register= async(req,res)=>{
    const {username, email, password}=req.body;
    

    try{
            // 1. Check if user exists
            console.log("Incoming data:", req.body);
            const userExist=await User.findOne({email});
            const usernameExists=await User.findOne({username});
            if(userExist){
                return res.status(409).json({msg: "User already exists"});
            }
            if(usernameExists){
                return res.status(409).json({msg:"username already exists try something else"});
            }

             // 2. Hash the password
            const hashedPassword=await bcrypt.hash(password,10);

            // 3. Save user
            const newUser=new User({username,email, password: hashedPassword});
            await newUser.save();

            const token=jwt.sign({id:newUser._id},JWT_SECRET,{expiresIn: "1h"});
            res.status(200).json({
                msg: "user registered successfully",
                token,
                user:{
                    id: newUser._id,
                    username: newUser.username,
                    email: newUser.email
                }

            });
    }
    catch(err){
        res.status(500).json({msg:"Error", error: err.message});
    }
};

// Login user

exports.login= async (req, res)=>{
    const{email, password}=req.body;
    try{
        // 1. Check if user exists
    const user=await User.findOne({email});
    if(!user){
        res.status(404).json({msg:"Invalid Credentials"});
    }

    //compare passwords
    const isMatch=await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(404).json({msg:"Invalid Credentials"});
    }
    
    // create JWT token
    const token=jwt.sign({id:user._id}, JWT_SECRET,{expiresIn:"1h"});
    res.json({
        token,
        user: {id: user._id,username:user.username, email: user.email }
    });

    }
    catch(err){
        res.status(500).json({msg:"Error", error:err.message});
    }

};