const express = require("express")
const path = require('path');
const imgfolder = path.join(__dirname, '../public/Images');
const userRouter = express.Router();
const multer=require("multer");
const {getAllusers, getusers, getcookies, postuser, setcookies, deleteuser, updateuser ,getuserProfile, updateProfileImage} = require("../controller/userController");
const {Logout,sendupdatepage,checkLogin,isAuthorized, getforgetpwd, resetpwd,forgetpassword, getSignup, postSignup, postLogin, getLogin, getresetpage } = require("../controller/authController")
const protectroute = require('./authhelper')
// userRouter.route('/').get(protectroute,getusers).post(postuser).patch(updateuser).delete(deleteuser)
//multer for file upload
let loc=imgfolder
console.log(loc)
const multerStorage=multer.diskStorage({
    destination:function(req,file,cb)
    {
        cb(null,loc)
    },
    filename:function(req,file,cb)
    {
        cb(null,`user-${Date.now()}.jpeg`)
    }

})
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
const upload =multer({
    storage:multerStorage,
    fileFilter:filter
})

userRouter.route("/signup").post(upload.single("photo"),postSignup);
userRouter.route("/login").post(postLogin);
userRouter.route("/forgotpassword").post(forgetpassword)
userRouter.route("/resetpassword/:token").post(resetpwd)

userRouter.route("/allusers").get(checkLogin,isAuthorized(['user']),getAllusers)
// for user spececific pages
userRouter.route('/updateprofile/:id').patch(updateuser).delete(deleteuser) // next to base
//profile page
userRouter.route("/userProfile").get(checkLogin, getuserProfile);
userRouter.route("/logout").get(Logout);

// route for admin


module.exports = userRouter;