const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://joban:yzSJge5kJQHr4mw5@cloudcluster.qvkdum5.mongodb.net/?retryWrites=true&w=majority").then(function (db) {
    console.log("review db connected");
}).catch(function (err) {
    console.log(err);
})
const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, "review is require field"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "rating is a required field"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "usermodel",
        required: [true, "need a user to review"],
        autopopulate: true
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planmodel",
        required: [true, "need a plan to be reviewed"],
        autopopulate: true
    }
})
//find pre hook
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name profileimg"
    }).populate({
        path: "plan"
    });
    next();
})
reviewSchema.plugin(require('mongoose-autopopulate'));
const reviewmodel = mongoose.model("reviewmodel", reviewSchema)
module.exports = reviewmodel