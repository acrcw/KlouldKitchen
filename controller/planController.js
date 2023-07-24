const planmodel = require("../modals/mealmodal");
const stripe = require("stripe")(
  "sk_test_51NVoSgSFnLmMeVsDYJcCwzpQmv0MX8VgN791e2ypGGyy9BHzGkoEz5VrjKjfP22SWTMSYKxFbLzdu4XsyDx6vIgS00WL8heiGv"
);
//done
module.exports.getAllPlans = async function getAllPlans(req, res) {
  try {
    // console.log("hello");
    let plans = await planmodel.find();
    if (plans) {
      return res.json({
        message: "all plans received",
        totalplans: plans.length,
        plans: plans,
      });
    } else {
      return res.json({
        message: "plans not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
//done
module.exports.getPlan = async function getPlan(req, res) {
  try {
    let id = req.params.id;
    // console.log(id)
    let plan = await planmodel.findById(id);
    if (plan) {
      return res.json({
        message: "plan recived",
        data: plan,
      });
    } else {
      return res.json({
        message: "not_found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
//done
module.exports.createPlan = async function createPlan(req, res) {
  try {
    let { planName, planDescription, planDuration, planPrice, planDiscount } =
      req.body;
    const createdproduct = await stripe.products.create({
      name: planName,
      description: planDescription,
      default_price_data: {
        currency: "INR",
        unit_amount: planPrice * 100,
      },
    });
    // console.log(createdproduct);
    let createdPlan = await planmodel.create({
      name: planName,
      description: planDescription,
      duration: planDuration,
      price: planPrice,
      discount: planDiscount,
      stripeId: createdproduct.id,
    });
    res.json({
      message: "plan created Sucessfully & product created in stripe",
      plan: createdPlan,
      product: createdproduct,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
module.exports.deletePlan = async function deletePlan(req, res) {
  try {
    let id = req.params.id;
    console.log(id)
    let deletedPlan = await planmodel.findByIdAndDelete(id);
    return res.json({
      message: "Plan deleted",
      data: deletedPlan,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
//done
module.exports.updatePlan = async function updatePlan(req, res) {
  try {
    let id = req.params.id;
    let plan = await planmodel.findById(id);
    // console.log(plan)
    let datatobeupdated = req.body;
    if (plan) {
      const keys = [];
      for (let key in datatobeupdated) {
        keys.push(key);
      }
      // console.log(keys)
      for (let i = 0; i < keys.length; i++) {
        plan[keys[i]] = datatobeupdated[keys[i]];
      }
      const updatedplan = await plan.save();
      return res.json({
        message: "plan updated",
        updateddata: updatedplan,
      });
    } else {
      res.json({
        message: "plan not found",
      });
    }
  } catch (err) {
    res.json({
      message: err,
    });
  }
};
// get top three plans
module.exports.topthreeplans = async function topthreeplans(req, res) {
  try {
    const top3plans = await planmodel
      .find()
      .sort({ ratingAverage: -1 })
      .limit(3);
    return res.status(200).json({ message: "plans", plans: top3plans });
  } catch (err) {
    return res.status(200).json({ message: "not_found" });
  }
};
