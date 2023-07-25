const fs = require('fs');
const bcrypt = require("bcrypt");

const path = require('path');
const imgfolder = path.join(__dirname, '../public/Images');
const jwt = require("jsonwebtoken");
const { JWT_KEY } = require("../secrets.js");
const usermodel = require("../modals/usermodal.js");
const { sendMail } = require("../utitility/nodeMailer.js");


module.exports.forgetpassword = async function forgetpassword(req, res) {
  let { email } = req.body;
  // console.log(email)
  try {
    const user = await usermodel.findOne({ email });

    if (user === null) {
      return res.status(404).json({
        user
      });
    } else {
      const resetToken = user.createResetToken();
      // console.log(resetToken);
      let resetPasswordLink = `${req.protocol}://${req.hostname}:${req.socket.localPort}/user/resetpassword/${resetToken}`;
      let obj = {
        resetPasswordLink: resetPasswordLink,
        email: email,
      };
      // console.log(obj);
      sendMail("resetpassword", obj);
      return res.json({
        resetPasswordLink: `/user/resetpassword/${resetToken}`
      });
    }
  } catch (err) {
    res.status(404).json({
      user
    });
  }
};
module.exports.resetpwd = async function resetpwd(req, res) {
  try {
    let token = req.params.token;
    // console.log(token)
    let { password, confirmPassword } = req.body;
    // console.log(req.body)

    jwt.verify(token, JWT_KEY, async function (err, decoded) {
      if (err) {
        return res.status(200).json({ message: "Token expired" });
      } else {
        // console.log(decoded)
        const user = await usermodel.findOne({ resetToken: token });
        if (user == null) {
          return res.status(400).json({

          });
        }
        // console.log(user);
        user.password = password;
        user.resetToken = "";
        const updatedpassworddoc = await user.save();
        // console.log(updatedpassworddoc)
        return res.status(202).json({
          user: updatedpassworddoc
        });
      }
    });
  } catch (err) {
    res.status(505).json({
      message: err.message,
    });
  }
};


module.exports.postSignup = async function postSignup(req, res) {
  // console.log(req.file.path)
  let data = req.body; 
  const image = req.file;
  console.log(image.buffer)
  console.log(req.body.profileimg)
  const tempFilePath = `${imgfolder}/${Date.now()}.jpeg`;
  fs.writeFileSync(tempFilePath, image.buffer);

  try {  

    let user = await usermodel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      profileimg: {
        data: image.buffer, // Save the image buffer
        contentType: image.mimetype, // Save the content type (e.g., "image/jpeg", "image/png", etc.)
      },
    });
    // fs.unlink(req.file.path)
    if (user) {
      sendMail("signup", user);
      res.status(200).json({ user: user });
    }
  } catch (err) {
    res.status(200).json({ message: "Signup Failed" });
  }
};
module.exports.postLogin = async function postLogin(req, res) {
  let data = req.body;
  // console.log(data)
  try {
    let user = await usermodel.findOne({ email: data.email }).exec();
    if (user) {
      bcrypt.compare(data.password, user.password, function (err, result) {
        if (result) {
          // console.log("compare passed");
          let uid = user["_id"]; //uid for jwt
          let token = jwt.sign({ payload: uid }, JWT_KEY, {
            expiresIn: 60 * 60 * 2,
          });
          res.cookie("Loggedin", token, {
            httpOnly: true,
            maxAge: 1000 * 60,
            secure: true,
          });
          res.status(200).json({
            message: "Success",
            user: user
          });
        } else {
          // console.log("error in password");
          res.status(200).json({ message: "Invalid Login/Password" });
        }
      });
    } else {
      // console.log("hello")
      res.status(200).json({ message: "Invalid Login/Password" });
    }
  } catch (err) {
    res.status(200).json({});
  }
  // console.log(user)
};


module.exports.isAuthorized = function isAuthorized(roles) {
  return function (req, res, next) {
    if (roles.includes(req.role)) {
      next();
    } else {
      res.status(200).json({ message: "Unauthorized Route" });
    }
  };
};
//protect route
module.exports.checkLogin = function protectroute(req, res, next) {
  if (req.cookies.Loggedin) {
    console.log(req.cookies.Loggedin)
    // var decoded = jwt.verify(req.cookies.Loggedin, JWT_KEY);
    jwt.verify(req.cookies.Loggedin, JWT_KEY, async function (err, decoded) {
      if (err) {
        return res.status(302).redirect("/user/login");
      } else {
        // console.log(decoded)
        const user = await usermodel.findById(decoded.payload);
        // console.log(user)
        req.role = user.role;
        req.id = user.id;
        next();
      }
    });
  } else {
    return res.status(200).json({ message: "login" });
  }
};
module.exports.Logout = async function Logout(req, res) {

  res.cookie("Loggedin", "", { httpOnly: true, maxAge: 1, secure: true });
  res.json({ message: "Loggedout" })
};
