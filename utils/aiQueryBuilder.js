
const { CohereClient } = require("cohere-ai");
require("dotenv").config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

async function getAIResponse(userInput) {
  if (!userInput || typeof userInput !== "string") {
    throw new Error("Invalid or empty user input.");
  }

  try {
    const response = await cohere.chat({
      model: "command-r",
      message: userInput,
    });

    const text = response.text?.trim();
    // console.log("Raw AI Response: from aiQueryBuilder.js file", response.text);
    if (!text) throw new Error("Empty AI response from aiQueryBuilder.js file");

    return text;
  } catch (err) {
    // console.error("Error in getAIResponse: from aiQueryBuilder.js file", err.message);
    throw new Error("AI failed to generate a response.from aiQueryBuilder.js file");
  }
}

module.exports = { getAIResponse };



// const { CohereClient } = require("cohere-ai");
// require("dotenv").config();

// const cohere = new CohereClient({
//   token: process.env.COHERE_API_KEY,
// });
// async function generateMongoQuery(userInput) {
//   if (!userInput || typeof userInput !== "string") {
//     throw new Error("Invalid or empty user input passed to AI.");
//   }
// console.log("userInput: from aiQueryBuilder.js", userInput);
//   const systemMessage = `
// You are a MongoDB expert assistant. Convert natural language user input into a valid MongoDB filter JSON based on the following schema:

// {
//   price: Number,
//   location: String,
//   country: String,
//   category: String,
//   title: String
// }

// Strictly return only valid MongoDB filter JSON. No text, no explanation. Only JSON.
//   `;

//   try {
//     const response = await cohere.chat({
//       model: "command-r",
//       message: userInput,
//       systemPrompt: systemMessage,
//     });

//     const text = response.text?.trim();
//     console.log("Raw AI Response:", text);

//     // First try parsing entire response
//     try {
//       return JSON.parse(text);
//     } catch (e1) {
//       // fallback: try to extract first valid JSON block using relaxed match
//       const jsonMatch = text.match(/{[\s\S]*}/);
//       console.log("jsonMatch: from aiQueryBuilder.js", jsonMatch);
//       if (!jsonMatch) throw new Error("AI response does not contain valid JSON.");

//       const cleanJson = jsonMatch[0];
//       return JSON.parse(cleanJson);
//       console.log("Parsed JSON: from aiQueryBuilder.js", JSON.parse(cleanJson));
//     }
//   } catch (err) {
//     console.error("Error in generateMongoQuery: from aiQueryBuilder.js", err.message);
//     throw new Error("AI failed to generate a valid query.");
//   }
// }

// module.exports = { generateMongoQuery };



