const bcrypt=require("bcrypt")
const { User } = require("../models/pollModel")
const { Op } = require("sequelize")
const jwt = require("jsonwebtoken")

const signUp=async(req,res)=>{
    try{
        const {username,email,password}=req.body
console.log(username,email,password,"userdata......")
        const isUserPresent=await User.findOne({
            where:{
                [Op.or]:[{username},{email}]
            }
        })

        if(isUserPresent){
            res.status(409).send({msg:"User already present"})
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=await User.create({username,email,password:hashedPassword})

        res.status(201).send({msg:"User registered successfull",userId:newUser.id})

    }catch(err){
        res.status(500).send({msg:"something went wrong please try again"})
    }
}


const login=async(req,res)=>{
    try{
        const {email,password}=req.body
        console.log(email,password,"logindata........")

        const user=await User.findOne({
            where:{email}
        })

        if(!user){
            res.status(401).send({msg:"invalid credentials please try again "})
        }

        const passwordMatch =await bcrypt.compare(password,user.password)

        if(!passwordMatch){
            res.status(401).send({msg:"Invalid password please try again"})
        }

        const token=jwt.sign({userId:user.id,username:user.username},"abhimaan",{
            expiresIn:"1h"
        })

        res.status(200).send({msg:"login successfull",token:token})

    }catch(err){
        res.status(500).send({msg:"something went wrong please try again"})
    }
}


const getUser=async(req,res)=>{
    try{
           const data= await User.findAll()
           res.status(200).send({msg:"fetched",data:data})
    }catch(err){
        res.status(500).send({msg:"Something went wrong please try again",err:err.message})
    }
}


module.exports={
    signUp,
    getUser,
    login
}