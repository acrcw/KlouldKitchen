const express = require("express");
const { checkLogin } = require("../controller/authController");
const { createSession, getproduct } = require("../controller/stripeController");
const stripeRouter = express.Router();
stripeRouter.route("/:id").get(getproduct).post(createSession)
module.exports=stripeRouter