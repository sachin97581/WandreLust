// const express = require("express");
// const router = express.Router();
// const { generateMongoQuery } = require("../utils/aiQueryBuilder");
// const Listing = require("../models/listing");

// router.get("/ai-search", async (req, res) => {
//   const userInput = req.query.q;
//   if (!userInput) return res.status(400).send("Query required");

//   try {
//     const mongoQuery = await generateMongoQuery(userInput);
//     console.log("Generated MongoDB Query:", mongoQuery);
//     const results = await Listing.find(mongoQuery);
//     console.log("Search Results:", results); // Print the results after rendering
//     // res.render("listings/searchResults", { results, userInput });
//    const res = res.json(results); // Send results as JSON for testing
//    console.log(res);
//   } catch (err) {
//     console.error("Error during AI search:", err.message);
//     res.status(500).send("Something went wrong with AI search. Please try again later.");
//   }
// });

// module.exports = router;














// const express = require("express");
// const router = express.Router();
// const { generateMongoQuery } = require("../utils/aiQueryBuilder");
// const Listing = require("../models/listing");

// router.post("/ai-search", async (req, res) => {
//   const userInput = req.body.query;

//   try {
//     const query = await generateMongoQuery(userInput);
//     const listings = await Listing.find(query);
//     res.render("listings/index", { listings });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Something went wrong with the AI search.");
//   }
// });

// module.exports = router;
