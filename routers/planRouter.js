const express = require("express")
const planRouter = express.Router();
const { checkLogin, isAuthorized } = require("../controller/authController");
const { createPlan, updatePlan, deletePlan, getAllPlans, getPlan, topthreeplans } = require("../controller/planController");
const protectroute = require("./authhelper");
//basic all plans
planRouter.route("/allplans").get(getAllPlans)
// ur plan u have currently have
planRouter.route("/plan/:id").get(getPlan)

planRouter.route("/createplan").post(checkLogin,isAuthorized(['admin','owner']),createPlan)
planRouter.route("/modifyplan/:id").patch(updatePlan).delete(deletePlan)
planRouter.route("/topplans").get(topthreeplans)

module.exports = planRouter;

