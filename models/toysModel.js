const mongoose = require("mongoose");
const Joi = require("joi");

const toySchema = new mongoose.Schema({
    name:String,
    info:String,
    category:String,
    img_url:String,
    price:Number,
    user_id:String,
    Date_created:{
        type:Date, default:Date.now()    
    }
});


const ToyModel = mongoose.model("toys",toySchema);
exports.ToyModel = ToyModel;

exports.validToy = (_badyData) => {
    let joiSchema = Joi.object({
        name:Joi.string().min(2).max(99).required(),
        info:Joi.string().min(2).max(999).required(),
        category:Joi.string().min(2).max(99).required(),
        img_url:Joi.string().min(2).max(300).allow(null,""),
        price:Joi.number().min(1).max(9999999).required(),
    })

    return joiSchema.validate(_badyData);
}