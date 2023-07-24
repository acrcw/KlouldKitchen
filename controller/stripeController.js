const planmodel = require('../modals/mealmodal');
const path = require('path');
const usermodel = require('../modals/usermodal');
const stripe = require('stripe')('sk_test_51NVoSgSFnLmMeVsDYJcCwzpQmv0MX8VgN791e2ypGGyy9BHzGkoEz5VrjKjfP22SWTMSYKxFbLzdu4XsyDx6vIgS00WL8heiGv');
const checkOutPath = path.join(__dirname, '../view/checkout.html');
module.exports.createSession = async function createSession(req, res) {
    try {
        let userId = req.id;
        // console.log(userId)
        let planId = req.params.id; 
        console.log(planId)
        const user = await usermodel.findById(userId);
        // const plan = await planmodel.findById(planId);
        const session = await stripe.checkout.sessions.create({
            // payment_method_types: ['card'],
            // customer_email: user.email,
            // client_refrence_id: plan.id,
            line_items: [
                {
                    // name: plan.name,
                    // description: plan.description,
                    price:`${PRICE_ID}`,
                    // currency: "inr",
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get("host")}paymentsuccess.html`,
            cancel_url: `${req.protocol}://${req.get("host")}paymentfail.html`,
        })
        console.log(session.url)
        res.redirect(303, session.url);
        // res.status(200).json({
        //     status: "success",
        //     session
        // })
    }catch(error)
    {
        res.status(400).json({
            err:error.message
        })
    }



}
module.exports.sendCheckOut=async function(req,res){
    res.sendFile(checkOutPath)

}