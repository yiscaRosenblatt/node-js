const express = require("express");
const bcrypt = require("bcrypt");
const {UserModel, validUser, validLogin,getToken} = require("../models/userModel");
const {authToken} = require("../auth/authToken")
const router = express.Router();

// הגדרת ראוטר לראוט שיוגדר לו באפ
// req - מה שמקבל השרת , ממשתנים ביו אר אל ועד מידע שמגיע מצד לקוח בבאדי
// res - התגובה שהשרת מחזיר בחזרה לצד לקוח


router.get("/userInfo",authToken, async(req,res) => {
    let user= await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(user)
})

router.post("/", async(req,res) => {
    let valiBody = validUser(req.body);
    if(valiBody.error){
      return res.status(400).json(valiBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "*****";
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json({err:"Email alredy in system or there anther problem"})
    }
   
  })


  router.post("/login", async(req,res) => {
    let valiBody = validLogin(req.body);
    if(valiBody.error){
      return res.status(400).json(valiBody.error.details);
    }
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
        return res.status(401).json({mas:"user not found"});
    }

    let passValid = await bcrypt.compare(req.body.password,user.password);
    if (!passValid){
        return res.status(401).json({mas:"password worng"});
    }

    let newToken = getToken(user._id,user.role) ;

    res.json({token:newToken});


  })
  




module.exports = router;