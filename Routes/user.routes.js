const express=require("express")
const { signUp, getUser, login } = require("../controller/userController")
const userRouter=express.Router()

userRouter.post("/signup",signUp)
userRouter.get("/getuser",getUser)
userRouter.post("/login",login)

module.exports={
    userRouter
}