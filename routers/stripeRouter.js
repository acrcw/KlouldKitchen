const express = require("express");
const { checkLogin } = require("../controller/authController");
const { createSession, getproduct, getprice } = require("../controller/stripeController");
const stripeRouter = express.Router();
stripeRouter.route("/:id").get(getproduct,getprice).post(createSession)

module.exports=stripeRouter