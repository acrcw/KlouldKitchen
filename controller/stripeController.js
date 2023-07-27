const planmodel = require('../modals/mealmodal');
const path = require('path');
const usermodel = require('../modals/usermodal');
const stripe = require('stripe')('sk_test_51NVoSgSFnLmMeVsDYJcCwzpQmv0MX8VgN791e2ypGGyy9BHzGkoEz5VrjKjfP22SWTMSYKxFbLzdu4XsyDx6vIgS00WL8heiGv');
const checkOutPath = path.join(__dirname, '../view/checkout.html');
module.exports.createSession = async function createSession(req, res) {
    try {
     
        try {
            // Get the payment information from the request body sent by the client
            const { amount, currency, token } = req.body;
            console.log(token)
            // Create a payment intent or charge the user using the Stripe API
            const paymentIntent = await stripe.paymentIntents.create({
              amount,
              currency,
              payment_method_types: ['card'],
              payment_method: JSON.stringify(token),
            });
        
            // Optionally, you can handle additional logic or actions here based on the payment result
        
            // Send the client secret or success status back to the frontend
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
          } catch (error) {
            // Handle any errors and send an error response
            res.status(500).json({ error: error.message });
          }
    }catch(error)
    {
        res.status(400).json({
            err:error.message
        })
    }
}
module.exports.getproduct = async function getproduct(req, res,next) {
  const Id = req.params.id;
  // console.log(Id);
  try {
    // Fetch the product from Stripe using the product ID
    const product = await stripe.products.retrieve(Id);
    // console.log(product)
    if(product)
    {
      req.id=product.default_price;
      req.name=product.description;
      // return res.json({message:"Found",product:product})
      next();
    }
    else
    { 
      return res.json({message:"Not_Found"})
    }
   
    
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
}
module.exports.getprice = async function getprice(req, res) {
  const Id = req.id;
  // console.log(Id);
  try {
    // Fetch the product from Stripe using the product ID
    const price = await stripe.prices.retrieve(Id);
    // console.log(price)
    if(price)
    {
      return res.json({message:"Found",price:price,name:req.name})
    }
    else
    { 
      return res.json({message:"Not_Found"})
    }
   
    
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Failed to fetch product details' });
  }
}
