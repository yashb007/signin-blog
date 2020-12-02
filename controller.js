const mongoose = require('mongoose')
const User = mongoose.model("User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');



exports.signup = (req,res) =>{
    const {first_name,last_name,email ,password} = req.body 
    if(!email || !password || !first_name ) {
     res.status(422).json({error:"please add all the fields"})
     return
    }

    User.findOne({email:email})
     .then((savedUser)=>{
      if(savedUser){
        return res.status(422).json({error:"user already exists with that email"})
      }})
   
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
              const user = new User({
                first_name,
                last_name,
                email,
                password : hashedpassword
              })
      
              user.save()
              .then(user=>{
                  res.json({message:"saved successfully",user})
              })
              .catch(err=>{
                  console.log(err)
              })
        })
    .catch(err=>{
      console.log(err)
    })
}

exports.signin = (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"successfully signed in"})
               const token = jwt.sign({_id:savedUser._id},'software')
            //   const {_id,name,email,followers,following,pic} = savedUser
               res.json({token,savedUser})
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
}


exports.signout = (req,res)=>{
    res.clearCookie("token")
    res.send({ message : "User signout Successfully"})
}