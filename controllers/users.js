const User = require("../models/user.js");
// SignIn get reaquest
module.exports.rendreSignupRoute = (req , res) => {
    res.render("users/signup.ejs");
}

// SignIn post reaquest to update or signin new user
module.exports.Signup = async(req ,res) => {
    try{
     let{username , email ,password} = req.body;
     let newUser = new User({username , email});
    let registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
     if(err){
         return next(err);
     }
     req.flash("success", "Welcome to Wandrelust");
     res.redirect("/listing");
    });
   // console.log(registeredUser);
    }catch(err){
     req.flash("error", err.message);
     res.redirect("/signup");
    }
 }

// LogIn get reaquest
module.exports.rendreLoginRoute =  (req , res) => {
    res.render("users/login.ejs");
};

// Router for login
module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome Back to Wanderlust!");
    // Use a fallback URL in case redirectUrl is undefined
    const redirectUrl = res.locals.redirectUrl || "/listing"; 
    delete req.session.redirectUrl; // Clear the redirect URL after using it
    res.redirect(redirectUrl);
};

// LogOut get reaquest
module.exports.Logout = (req ,res , next) => {
    req.logout((err) => {
        if(err){
          return  next(err);
        }
        req.flash("success", "You Logged Out !");
        res.redirect("/listing");
    });
};