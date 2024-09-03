// const express = require('express');
// const axios = require('axios');
// const router = express.Router();

// router.post('/', async (req, res) => {
//   const { sentence } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-4o-mini",
//         messages: [
//           { role: "system", content: "You are a helpful assistant that rephrases sentences. Only return the rephrased sentences without any additional comments or context." },
//           {
//             role: "user",
//             content: `${sentence}`,
//           },
//         ],
//         max_tokens: 150,
//         n: 3, // Get three different rephrasing suggestions
//         stop: null,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       }
//     );

//     const rephrasedSentences = response.data.choices.map(choice => choice.message.content.trim());

//     res.json({ rephrasedSentences });
//   } catch (error) {
//     console.error('Error processing sentence:', error);
//     res.status(500).json({ error: 'Error processing sentence' });
//   }
// });

// module.exports = router;




// const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { sentence } = req.body;
//   console.log(`API key is ${process.env.API_KEY}`);

//   // Initialize the API with your key
//   const genAI = new GoogleGenerativeAI(process.env.API_KEY);

//   // Specify the model you want to use
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   // Create the role-based prompt for rephrasing
//   const prompt = `You are a helpful assistant that rephrases sentences. Only return the rephrased sentences without any additional comments or context.

//   User: ${sentence}`;

//   try {
//     const rephrasedSentences = [];

//     // Generate three different rephrased responses
//     for (let i = 0; i < 3; i++) {
//       const result = await model.generateContent(prompt);
//       const rephrasedSentence = result.response.text().trim();
//       rephrasedSentences.push(rephrasedSentence);
//     }

//     // Send the array of rephrased sentences
//     res.json({ rephrasedSentences });
//   } catch (error) {
//     console.error("Error generating content:", error);
//     res.status(500).json({ error: "Failed to generate content" });
//   }
// });

// module.exports = router;



const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const router = express.Router();

router.post("/", async (req, res) => {
  const { sentence } = req.body;
  console.log("reached at rephrase apicall");

  // Initialize the API with your key
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);

  // Specify the model you want to use
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Function to generate a variation of the prompt
  const generatePromptVariation = (sentence, variationNumber) => {
    return `You are a helpful assistant that rephrases sentences. Provide a rephrased version that differs slightly from the previous ones. This is variation number ${variationNumber}. Only return the rephrased sentence without any additional comments or context.

    User: ${sentence}`;
  };

  try {
    const rephrasedSentences = [];

    // Generate three different rephrased responses with variations
    for (let i = 1; i <= 3; i++) {
      const prompt = generatePromptVariation(sentence, i);
      const result = await model.generateContent(prompt);
      const rephrasedSentence = result.response.text().trim();
      rephrasedSentences.push(rephrasedSentence);
    }

    // Send the array of rephrased sentences
    res.json({ rephrasedSentences });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

module.exports = router;

