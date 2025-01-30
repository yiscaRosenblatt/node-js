// הגדרת ראוטר בשביל כתובות הראוט
const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");

exports.routesInit = (app) => {
  // הגדרת ראוט והראוטר שהוא משתמש בו
  app.use("/",indexR);
  app.use("/toys",toysR);
  app.use("/users",usersR);

}