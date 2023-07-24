const express = require("express");
const { checkLogin } = require("../controller/authController");
const { getAllReviews, topthreereviews, getPlanReviews, createReview, updateReview, deleteReview, getUserReviews, getReviewbyid } = require("../controller/reviewController");
const reviewRouter = express.Router();


reviewRouter.route("/all").get(getAllReviews)
reviewRouter.route("/review/:id").get(getReviewbyid)
reviewRouter.route("/top3").get(topthreereviews)
reviewRouter.route("/:planid").get(getPlanReviews)
reviewRouter.route("/userreviews/:id").get(getUserReviews)
reviewRouter.route("/:plan").post(createReview)
reviewRouter.route("/review/:reviewid").patch(updateReview)
reviewRouter.route("/review/:reviewid").delete(deleteReview)
module.exports = reviewRouter;