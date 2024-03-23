const express = require('express');
const app = express();
const { Configuration, OpenAIApi } = require("openai"); // Replace with the actual library you are using

app.use(express.json());

// Handle CORS (Cross-Origin Resource Sharing) to allow requests from different origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Replace this with your actual OpenAI API key
const openai = new OpenAIApi({ apiKey: 'sk-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' });

// Define a route to handle API requests
app.post('/api/investment-guide', async (req, res) => {
  const { query } = req.body;

  try {
    // Call the OpenAI API to generate the response based on the user's query
    const response = await openai.createCompletion({
      engine: 'text-davinci-002', // Choose the appropriate engine
      prompt: query,
      max_tokens: 50, // Adjust the response length as needed
    });

    // Extract the generated response from the API result
    const responseData = response.choices[0].text;

    res.json({ response: responseData });
  } catch (error) {
    res.status(500).json({ error: 'Error generating the investment guide.' });
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
