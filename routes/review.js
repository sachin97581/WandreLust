const express = require("express");
const router = express.Router({mergeParams : true});   // mergeParams learn about in exress documntation
const Listing =  require("../models/listing.js"); // this module 1
const wrapErr = require("../utils/wrapAsync.js");   
const Review =  require("../models/review.js");  // module 2
const{validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");
const controllerReviews = require("../controllers/review.js");

// Review 
// post route
router.post("/",validateReview, isLoggedIn,wrapErr(controllerReviews.createReview));
  
  // Delete Review 
  router.delete("/:reviewId", isReviewAuthor,wrapErr(controllerReviews.deleteReview));

  module.exports = router;