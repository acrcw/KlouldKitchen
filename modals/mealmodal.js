const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://joban:yzSJge5kJQHr4mw5@cloudcluster.qvkdum5.mongodb.net/?retryWrites=true&w=majority").then(function (db) {
    console.log(" meals db connected");
    // console.log(db);
}).catch(function (err) {
    console.log(err);
})
const planSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxLength: [20, "Plan name should not exceed more than 20 characters"]
    },
    description: {
        type: String,
        required: [true,"Desciption need"]
    },
    stripeId:{
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: [true, "Price is a required field"]
    },
    ratingAverage: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    discount: {
        type: Number,
        validate: [function () {
            return this.discount < 100
        }, "discount should not exceed 100"],
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }

})

const planmodel = mongoose.model("planmodel", planSchema)


module.exports = planmodel