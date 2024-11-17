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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));  // we ues static beacause we can serve code of css , JavaScript from Public folder

// This is for MongoDB for system strorage

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
 main().catch(err => console.log(err));
async function main() {
  mongoose.connect(mongo_url);      
}

// This is for MongoDB Atlas 

//  const dbUrl = process.env.ATLASDB_URL;
// main().catch(err => console.log(err));
// async function main() { 
//  mongoose.connect(dbUrl);      
// }


const store = MongoStore.create({
    // mongoUrl: dbUrl,
    mongoUrl: mongo_url,
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
        console.error("Error fetching listings:", error);
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