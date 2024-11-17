const express = require("express");
const router = express.Router();
const Listing =  require("../models/listing.js"); // this module 1
const wrapErr = require("../utils/wrapAsync.js");   
const{validateListing} = require("../middlewares.js");
const {isLoggedIn,  isOwner} = require("../middlewares.js");
const ListingController = require("../controllers/listing.js"); 
const multer  = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });
// const categoryes = require('../categoryes');
// const upload = multer({ dest: 'uploads/' });

// we router.route where the routes are same 
// Using router.route(path) is a recommended approach to avoiding duplicate route naming and thus typo errors.

// router.route("/")
// .get(ListingController.indexRoute)    // index Route
// // .post( validateListing,isLoggedIn, wrapErr(ListingController.createListing));  // Add new List
// .post(upload.single('listing[image]'),(req , res) => {
//     console.log(req.file);
//     res.send(req.file);
// });



// here Some error occurs after using router.route(path)


// index Route
router.get("/", ListingController.indexRoute);

// router.route("/:id")
// .get(wrapErr(ListingController.showNewListing))   // Show Route
// .put(isLoggedIn,isOwner, wrapErr(ListingController.updateListing));    // UPdate Route


// create new Route
router.get("/new", isLoggedIn, ListingController.rendreNewRoute);

// Add new List
 router.post('/',isLoggedIn, upload.single('listing[image]'),validateListing, wrapErr(ListingController.createListing));

    // router.post('/', upload.single('listing[image]'),(req , res) => {
    //     res.send(req.file);
    // });

// Show Route
router.get("/:id" ,wrapErr(ListingController.showNewListing));  // we extrect "ListingController.index" from controllers\listing.js 

// Edit Route

router.get("/:id/edit" ,isLoggedIn,isOwner,wrapErr(ListingController.rendreEditRoute));

// UPdate Route

router.put("/:id",isLoggedIn,upload.single('listing[image]'), isOwner, wrapErr(ListingController.updateListing));


// Delete Route

router.delete("/:id",isLoggedIn, isOwner ,wrapErr(ListingController.destroyListing));


module.exports = router;