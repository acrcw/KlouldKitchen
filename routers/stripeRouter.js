const express = require("express");
const { checkLogin } = require("../controller/authController");
const { createSession, sendCheckOut } = require("../controller/stripeController");
const stripeRouter = express.Router();
stripeRouter.route("/checkout/:planid").get(checkLogin,sendCheckOut).post(checkLogin,createSession)
module.exports=stripeRouter