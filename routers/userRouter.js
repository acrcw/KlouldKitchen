const express = require("express")

const userRouter = express.Router();
const multer=require("multer");
const fileUpload = require('express-fileupload');
const {getAllusers, getusers, getcookies, postuser, setcookies, deleteuser, updateuser ,getuserProfile, updateProfileImage} = require("../controller/userController");
const {Logout,sendupdatepage,checkLogin,isAuthorized, getforgetpwd, resetpwd,forgetpassword, getSignup, postSignup, postLogin, getLogin, getresetpage } = require("../controller/authController")
const protectroute = require('./authhelper')
// userRouter.route('/').get(protectroute,getusers).post(postuser).patch(updateuser).delete(deleteuser)
//multer for file upload

// const multerStorage=multer.diskStorage({
//     destination:function(req,file,cb)
//     {
//         cb(null,loc)
//     },
//     filename:function(req,file,cb)
//     {
//         cb(null,`user-${Date.now()}.jpeg`)
//     }
app.use(fileUpload());
// })
// const storage=multer.memoryStorage();
const filter=function (req,file,cb)
{
    if(file.mimetype.startsWith("image"))
    {
        cb(null,true)
    }else
    {
        cb(new Error("Not an Image"),false)
    }
}
// const upload = multer({ storage: storage });
// const upload =multer({
//     storage:multerStorage,
//     fileFilter:filter
// })

userRouter.route("/signup").post(upload.single("image"),postSignup);
userRouter.route("/login").post(postLogin);
userRouter.route("/forgotpassword").post(forgetpassword)
userRouter.route("/resetpassword/:token").post(resetpwd)

userRouter.route("/allusers").get(checkLogin,isAuthorized(['user']),getAllusers)
// for user spececific pages
userRouter.route('/updateprofile/:id').patch(upload.single("image"),updateuser).delete(deleteuser) // next to base
//profile page
userRouter.route("/userProfile").get(checkLogin, getuserProfile);
userRouter.route("/logout").get(Logout);

// route for admin


module.exports = userRouter;