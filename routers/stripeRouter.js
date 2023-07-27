const express = require("express");
const { checkLogin } = require("../controller/authController");
const { createSession, sendCheckOut } = require("../controller/stripeController");
const stripeRouter = express.Router();
stripeRouter.route("/:productid").post(createSession)
module.exports=stripeRouter