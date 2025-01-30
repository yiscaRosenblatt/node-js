const jwt = require("jsonwebtoken");
require("dotenv").config()

exports.authToken = (req, res, next) => {

    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "you must send token" })
    }
    try {
        let decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.tokenData = decodeToken;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "token invalid or expired" })
    }
}