// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// router.post('/', async (req, res) => {
//   const { text } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are a helpful assistant that checks and corrects grammar errors in the following text. Only return the corrected text without any additional comments or context." },
//           {
//             role: "user",
//             content: `${text}`,
//           },
//         ],
//         max_tokens: 150,
//         n: 1,
//         stop: null,
//         temperature: 0.5,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );

//     const correctedText = response.data.choices[0].message.content.trim();
//     res.json({ correctedText });
//   } catch (error) {
//     console.error('Error checking grammar:', error);
//     res.status(500).json({ error: 'Error checking grammar' });
//   }
// });

// module.exports = router;



const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

router.post("/", async (req, res) => {
  const { text } = req.body;
  console.log("reached at grammer apicall");

  // Initialize the API with your key
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  // Specify the model you want to use
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Create the role-based prompt for grammar checking
  const prompt = `You are a helpful assistant that checks and corrects grammar errors in the following text. Only return the corrected text without any additional comments or context.

  User: ${text}`;

  try {
    // Generate the response from the model
    const result = await model.generateContent(prompt);

    // Extract and send the corrected text
    const correctedText = result.response.text().trim();
    res.json({ correctedText });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

module.exports = router;

