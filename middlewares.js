const user = require("./models/user");
const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
     // console.log(req.user);
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please Login First !");
        return res.redirect("/login"); // Use return to prevent calling next() after redirect
    }
    next();
}


module.exports.saveredirectUrl = (req ,res , next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    try {
        const { id } = req.params;
        const listingData = await Listing.findById(id);
        if (!listingData.owner.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the owner of this Listing!");
            return res.redirect(`/listing/${id}`);
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass any errors to the error handler
    }
};

// module.exports.isOwner = async (req, res, next) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
//         req.flash("error", "You are not owner of this Listing!");
//        return res.redirect(`/listing/${id}`);
//     }
//     next();
// }

module.exports.isReviewAuthor = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        const ReviewData = await Review.findById(reviewId);
        if (!ReviewData.author.equals(res.locals.currUser._id)) {
            req.flash("error", "You are not the author of this review!");
            return res.redirect(`/listing/${id}`);
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        next(error); // Pass any errors to the error handler
    }
};


// vadidation for server side error handling/ server side validation
// this is for listingSchema

module.exports.validateListing = ((req ,res, next) => {
    const {error} = listingSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }else{
        next();
    }
});


// vadidation for server side error handling/ server side validation
// this for reviewSchema

module.exports.validateReview = ((req ,res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }else{
        next();
    }
});