const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapErr = require("../utils/wrapAsync.js"); 
const passport = require("passport");
const { saveredirectUrl } = require("../middlewares.js");
const userCotroller = require("../controllers/users");


// SignIn get reaquest
router.get("/signup", userCotroller.rendreSignupRoute);

// SignIn post reaquest to update or signin new user
router.post("/signup", wrapErr(userCotroller.Signup));

// LogIn get reaquest
router.get("/login",userCotroller.rendreLoginRoute);

// LogIn post reaquest to  LogIn new user

// router.post("/login",saveredirectUrl,passport.authenticate("local",{ failureRedirect : "/login", failureFlash: true}),  async(req ,res) => {
//     req.flash("success", "Welcome Back to Wanderlust!");
//     res.redirect(res.locals.redirectUrl);
// });

// Router for login
router.post("/login", saveredirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userCotroller.Login);


// LogOut get reaquest
router.get("/logout", userCotroller.Logout);





module.exports = router;