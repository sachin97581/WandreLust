const Listing = require("../models/listing.js");
const Review = require("../models/review.js");



module.exports.createReview = async(req , res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);  // error come from this line 
    newReview.author = req.user._id;
    // console.log(newReview);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
   // console.log("review has saved");
   req.flash("success", "Review added !");
    res.redirect(`/listing/${listing._id}`);
  };

  module.exports.deleteReview = async(req ,res) => {
    let {id , reviewId} = req.params;  // extrect both id 
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}}); // pull/delete the review from the listing we use pull(mongoose method) to delete some data from Schema object array(exist in Schema object)
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted !");
    res.redirect(`/listing/${id}`);
};