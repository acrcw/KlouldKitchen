const jwt = require('jsonwebtoken');
const {JWT_KEY} = require("../secrets")
function protectroute(req, res, next) {
    if (req.cookies.Loggedin) {
        // var decoded = jwt.verify(req.cookies.Loggedin, JWT_KEY);
        jwt.verify(req.cookies.Loggedin, JWT_KEY, function (err, decoded) {
            if (err) {
                return res.redirect("/user/login")
            }
            else {
                // console.log(decoded) // bar
                next();
            }

        });


    }
    else {
        return res.redirect("/user/login")
    }
}
module.exports = protectroute