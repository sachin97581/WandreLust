// listings is my module in mongodb and 
// listing is my route name form localhost 

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
// console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");   
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");  // this a router
const reviewRouter =require("./routes/review.js");     // this a router
const userRouter = require("./routes/user.js");    // this a router
const Listing = require("./models/listing.js");
//const session =require("cookie-session");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");
// open ai
const { generateMongoQuery } = require("./utils/aiQueryBuilder");
const { getAIResponse } = require("./utils/aiQueryBuilder"); // Import the function from openai.js



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));  // we ues static beacause we can serve code of css , JavaScript from Public folder


// This is for MongoDB for system strorage

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
//  main().catch(err => console.log(err));
// async function main() {
//   mongoose.connect(mongo_url);      
// }

// This is for MongoDB Atlas 

 const dbUrl = process.env.ATLASDB_URL;
main().catch(err => console.log(err));
async function main() { 
 mongoose.connect(dbUrl);      
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    // mongoUrl: mongo_url,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 60 * 60
});

store.on("error", function(err){
    console.log("Error in Mongo Session Store", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resve: false,
    saveUninitialized: true,
    cookie: {
        expire : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge :  7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.use(session(sessionOptions));
app.use(flash());


// User Authentication

          // learn more about it visit/search npm passport-local-mongoose and study it all about line : 47,48,52,53
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// open ai

// app.get("/ai-search", async (req, res) => {
//     const userInput = req.query.query;
//     if (!userInput) return res.status(400).send("Query required");
  
//     try {
//       const mongoQuery = await generateMongoQuery(userInput);
//       console.log("MongoDB Query: from index.js file", mongoQuery); // Log the generated query for debugging
//       const results = await Listing.find(mongoQuery);
//       console.log("Results: from index.js file", results); // Log the results for debugging
//       // Optional: Ask AI to suggest more related results (titles, locations, etc.)
//       const relatedPrompt = `
//   User searched: "${userInput}". These results were found: ${results.map(r => r.title).join(", ")}.
//   Can you suggest other listings or ideas related to this search?
//   `;
  
//       const relatedResponse = await cohere.chat({
//         model: "command-r-plus",
//         message: relatedPrompt,
//       });
  
//       const suggestion = relatedResponse.text;
//       console.log("AI Suggestion: from index.js file", suggestion); // Log the AI suggestion for debugging
//     res.send(`
//         <style>
//           body { font-family: Arial, sans-serif; margin: 2rem; }
//           h2, h3 { color: #2c3e50; }
//           ul { list-style: none; padding: 0; }
//           li { background: #f9f9f9; margin-bottom: 0.5rem; padding: 0.7rem; border-radius: 8px; }
//           p { background: #e8f0fe; padding: 1rem; border-radius: 10px; }
//           .back-btn { margin-top: 1rem; display: inline-block; text-decoration: none; background: #3498db; color: white; padding: 0.5rem 1rem; border-radius: 5px; }
//         </style>
//         <h2>🔍 AI Search Results for: <em>${userInput}</em></h2>
//         <ul>
//           ${results.length > 0 ? results.map(r => `<li><strong>${r.title}</strong> | ${r.location}, ${r.country} - ₹${r.price}</li>`).join("") : "<li>No matching results found.</li>"}
//         </ul>
//         <h3>💡 AI Suggestions:</h3>
//         <p>${suggestion}</p>
//         <a href="/" class="back-btn">🔙 Back to Search</a>
//       `);
//     } catch (err) {
//       console.error("Error during AI search: from index.js file", err.message);
//       res.status(500).send("Something went wrong with AI search.");
//     }
//   });



// this is for AI search which is wroking 
  
  app.get("/ai-search", async (req, res) => {
    const userInput = req.query.query;
    if (!userInput) return res.status(400).send("Query required");
  
    try {
      const aiResponse = await getAIResponse(userInput);
        // console.log("AI Response: from index.js file", aiResponse); // Log the AI response for debugging
    //   res.send(`<h2>AI Response:</h2><p>${aiResponse}</p>`);
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>AI Response</title>
          <link rel="stylesheet" href="/css/aiResponse.css" />  
        </head>
        <body>
          <div class="response-container">
            <h2>👋 Welcome to Wanderlust AI</h2>
            <p class="intro">Let’s explore the best stays for your next adventure!</p>
            <hr />
            <h3>🤖 Here's what AI has to say:</h3>
            <div class="response-box">${aiResponse}</div>
            <a href="/listing" class="back-btn">🔙 Back to Home</a>
          </div>
        </body>
        </html>
      `);
      
    } catch (err) {
    //   console.error("Error during AI search: from index.js file", err.message);
      res.status(500).send("Something went wrong with AI search. from index.js file");
    }
  });
  


// flash the pop up 
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user; // Set currUser to null if req.user is undefined
    next();
});



// For Rooms 

app.get("/rooms", async (req, res) => {
    try {
        const allListing = await Listing.find({ category: "ROOM" }); // Only fetch rooms
        res.render("category/rooms", { allListing }); // Assuming "rooms" is the EJS template
    } catch (error) {
        // console.error("Error fetching listings:", error);
        res.status(500).send("Error fetching listings");
    }
});

app.get("/trending", async(req ,res) => {
    try{
        const allListing  = await Listing.find({category:"TRENDING"});
        res.render("category/trending", {allListing});
    }catch(error){
        console.error("Error fetching listings:", error);
        res.status(500).send("Error fetching listings");
    }
});


// there is an error
app.get("/iconic_cities", async(req ,res) => {
    try{
        const allListing = await Listing.find({category:"ICONIC CITIES"});
        res.render("category/iconic_cities", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching iconic cities");
    }
});

app.get("/mountains", async(req ,res) => {
    try{
        const allListing = await Listing.find({category:"MOUNTAINS"});
        res.render("category/mountain", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching mountains");
    }
});

app.get("/castels", async(req ,res) => {
    try{
        const allListing = await Listing.find({category:"CASTLES"});
        res.render("category/castles", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching castles");
    }
});

app.get("/amazing_pools", async(req ,res) => {
    try{
        const allListing = await Listing.find({category:"AMAZING POOLS"});
        res.render("category/amazing_pools", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching amazing places");
    }
});

app.get("/camping", async(req ,res) => {
    try{
        const allListing = await Listing.find({category:"CAMPING"});
        res.render("category/camping", {allListing});
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching campings");
    }
});

app.get("/farms", async(req ,res) => {
    try{
        const allListing = await Listing.find({category:"FARMS"});
        res.render("category/farms", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching farms");
    }
});

app.get("/arctic", async(req ,res) => {
    try{
        const allListing = await Listing.find({category:"ARCTIC"});
        res.render("category/arctic", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching arctic");
    }
});

app.get("/domes", async(req, res)  =>{
    try{
        const allListing = await Listing.find({category:"DOMES"});
        res.render("category/domes", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching Domes");
    }
});

app.get("/boats" , async(req , res) =>{
    try{
        const allListing = await Listing.find({category:"BOATS"});
        res.render("category/boats", {allListing});
    }catch(error){
        console.log(error);
        res.status(500).send("Error fetching boats");
    }
});

// book now
app.get("/listing/:id/booknow", async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch listing by ID
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Your listing was not found!");
            return res.redirect("/listing"); // Ensure no further code runs
        }
        // Transform image URL for resizing (if available)
        let originalImage = listing.image?.url || ""; // Safe access
        if (originalImage) {
            originalImage = originalImage.replace("/upload", "/upload/w_450,h_250");
        }
        // Set success flash message
        req.flash("success", "Ready to book your listing!");

        // Render the booking page
        res.render("listing/booknow.ejs", { listing, originalImage });

    } catch (error) {
        console.error(error); // Log error for debugging
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listing");
    }
});



app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/", userRouter);


// Express Error 
app.all("*", (req ,res , next) => {
    next(new ExpressError(404 , "Page Not Found !"));
})

app.use((err, req, res, next) =>{
    let{statusCode = 400 , message = "somthing went Wrong !"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);   // for error hendling
});


app.listen(port, () => {
    console.log("app is listening");
});