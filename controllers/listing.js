// we create controller for control main fumctionality of listing 
// we create to make our code clean and easy to read
const { models } = require("mongoose");
const Listing = require("../models/listing.js");

// index Route
module.exports.indexRoute = async (req , res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", {allListing});
}


// create new Route
module.exports.rendreNewRoute = (req , res) => {
    res.render("listing/new.ejs");
}


// this code of show route from listing
module.exports.showNewListing =async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Your listing not found !");
        res.redirect("/listing");
    }
    // console.log("owner");
    res.render("listing/show.ejs" , {listing});
    //console.log(listing);
}

// Add new List
module.exports.createListing = async (req, res, next) => {
   try {
    let url = req.file.path;
    let filename = req.file.filename;
     // console.log(url, ".." , filename);
   const { title, description, image, price, location  , category, country } = req.body; // Destructure incoming data
    // Create a new listing using the validated data
    const newListing = new Listing({
        title,
        description,
        image: image || "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",  // Default image if none provided
        price,
        location,
        category,
        country
    });

    // Save the new listing to the database
    newListing.owner = req.user._id;
   newListing.image = {url, filename};
   let result = await newListing.save();
    // console.log(result);
    req.flash("success", "New Listing Created !");
    res.redirect('/listing');
   } catch (error) {
    console.log(error);
    
   }
   // console.log(result);         // Log the saved listing
}


// Edit Route

module.exports.rendreEditRoute = async (req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Your listing not found !");
        res.redirect("/listing");
    }
    let originalImage = listing.image.url;
    originalImage= originalImage.replace("/upload", "/upload/w_450,h_250");
    //console.log(originalImage);
    //console.log(listing.image.filename);
    req.flash("success", "Listing Edited !");
    res.render("listing/edit.ejs", {listing, originalImage});
 
};

// UPdate Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    // First, find the listing by ID to check if it exists
    let listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Your listing not found!");
        return res.redirect("/listing");  // Redirect to a default page if listing is not found
    }

    // Update fields directly from req.body
    listing.title = req.body.title;
    listing.description = req.body.description;
    listing.price = req.body.price;
    listing.location = req.body.location;
    listing.country = req.body.country;
    listing.category = req.body.category;

    // If the image file is uploaded, update the image
    if (req.file) {
        listing.image = {
            url: req.file.path,  // Assuming Cloudinary or local path
            filename: req.file.filename,
        };
    }

    // Save the updated listing
    await listing.save();

    req.flash("success", "Listing updated!");
    
    // Redirect to the updated listing page
    res.redirect(`/listing/${id}`);
};


// Delete Route
module.exports.destroyListing = async (req ,res) => {
    let {id} = req.params;
   const deletelsit = await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing Deleted !");
   // console.log(deletelsit);
   res.redirect("/listing");
};
