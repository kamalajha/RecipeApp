const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

router.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: userMessage }]
  });

  res.json({ reply: response.choices[0].message.content });
});

module.exports = router;