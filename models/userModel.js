const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,  
        default: "user"
    },
    Date_created:{
        type:Date, default:Date.now()    
    },
});


// exports.createToken = (_id) =>{
//     let token = jwt.sign({_id},config.tokenSecret,{expiresIn:"60mins"});
// }




exports.getToken = (_userId,role) =>{
    let token = jwt.sign({_id:_userId,role},process.env.TOKEN_SECRET,{expiresIn:"60mins"});
    return token;
}



exports.UserModel = mongoose.model("users",userSchema);


exports.validUser = (_badyData) => {
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        email:Joi.string().min(2).max(100).required().email(),
        password:Joi.string().min(2).max(100).required()
        
    })
    
    return joiSchema.validate(_badyData);
}


exports.validLogin = (_badyData) => {
    let joiSchema = Joi.object({
        email:Joi.string().min(2).max(100).required().email(),
        password:Joi.string().min(2).max(100).required()
        
    })
    
    return joiSchema.validate(_badyData);
}