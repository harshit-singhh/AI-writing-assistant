
// const express = require("express");
// const axios = require("axios");
// const router = express.Router();



// RATE LIMITING METHOD 


// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const makeRequestWithRetry = async (options, retries = 3, delayMs = 1000) => {
//   for (let i = 0; i < retries; i++) {
//     try {
//       return await axios(options);
//     } catch (error) {
//       if (error.response && error.response.status === 429 && i < retries - 1) {
//         console.log(`Retrying request (${i + 1}/${retries})...`);
//         await delay(delayMs);
//         delayMs *= 2; // Exponential backoff
//       } else {
//         throw error;
//       }
//     }
//   }
// };

// router.post("/", async (req, res) => {
//   const { text } = req.body;

//   try {
//     const response = await makeRequestWithRetry({
//       method: "post",
//       url: "https://api.openai.com/v1/chat/completions",
//       data: {
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "system",
//             content:
//               "You are a helpful assistant that checks and corrects spelling errors in the following text. Only return the corrected text without any additional comments or context.",
//           },
//           { role: "user", content: `${text}` },
//         ],
//         max_tokens: 150,
//         n: 1,
//         stop: null,
//         temperature: 0.5,
//       },
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//     });

//     const correctedText = response.data.choices[0].message.content.trim();
//     res.json({ correctedText });
//   } catch (error) {
//     console.error("Error checking spelling:", error.message);
//     res.status(500).json({ error: "Error checking spelling" });
//   }
// });

// module.exports = router;





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
//           { role: "system", content: "You are a helpful assistant that checks and corrects spelling errors in the following text. Only return the corrected text without any additional comments or context." },
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
//     console.error('Error checking spelling:', error.message);
//     res.status(500).json({ error: 'Error checking spelling' });
//   }
// });







const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

router.post('/', async (req, res) => {
  const { text } = req.body;

  console.log("reached at spellcheck apicall");

  // Initialize the API with your key
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  // Specify the model you want to use
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Create the role-based prompt for spelling correction
  const prompt = `You are a helpful assistant that checks and corrects spelling errors in the following text. Only return the corrected text without any additional comments or context.

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
