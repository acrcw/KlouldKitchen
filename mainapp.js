//post request send data from frontend to backend
const express = require("express")
const app = express();
const cookieParser = require("cookie-parser")
const stripe = require('stripe')('sk_test_51NVoSgSFnLmMeVsDYJcCwzpQmv0MX8VgN791e2ypGGyy9BHzGkoEz5VrjKjfP22SWTMSYKxFbLzdu4XsyDx6vIgS00WL8heiGv');
const cors = require('cors')
app.use(express.static('public/build'))
app.use(express.json()); // middleware fnc used in post // to convert data into json
app.use(cookieParser()) // to use as middleware  to acess cokkies in request and response object
app.use(cors({
    credentials: true,
    origin:['https://localhost:3000']
    
}))
const port=process.env.PORT || 3000;
app.listen(port,function(){
    console.log("Port ",port)
})
//mini app  
const userRouter = require("./routers/userRouter")
const planRouter = require("./routers/planRouter");
const reviewRouter = require("./routers/reviewRouter");
const stripeRouter = require("./routers/stripeRouter");
app.route("/").get(redirecttologin)
function redirecttologin(req, res) {
    // console.log(__dirname)
    res.redirect("/user/login");
}

app.use('/user', userRouter) // base routes
app.use('/plans', planRouter) //plan routes   
app.use('/reviews', reviewRouter) //plan routes   
app.use('/stripe', stripeRouter) //plan routes   

// async function createprice() {
//     const price = await stripe.prices.create({
//         product:"abc",
//         unit_amount: 1000,
//         currency: 'inr',
//     })}