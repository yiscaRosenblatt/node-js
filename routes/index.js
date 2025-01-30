const express = require("express");
const router = express.Router();

// הגדרת ראוטר לראוט שיוגדר לו באפ
// req - מה שמקבל השרת , ממשתנים ביו אר אל ועד מידע שמגיע מצד לקוח בבאדי
// res - התגובה שהשרת מחזיר בחזרה לצד לקוח
router.get("/", async(req,res) => {
  res.json({msg:"Express work index.js 2222"})
})


module.exports = router;