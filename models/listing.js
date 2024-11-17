const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review =  require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  category: String,  // new field
  location: String,
  country: String,
  reviews : [{
    type : Schema.Types.ObjectId,
    ref : "Review"
  }],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User"
  },
});

// Pre-save middleware to convert category to uppercase
listingSchema.pre('save', function (next) {
  if (this.category) {
    this.category = this.category.toUpperCase();
  }
  next();
});

// when we delete a listing and we want also delete the data of all review with listing we use 
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });  
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

