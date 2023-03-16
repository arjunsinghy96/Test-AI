// Import the required libraries
const express = require('express');
const openai = require('openai');

// Set up your OpenAI API key
const OPENAI_API_KEY = 'your_api_key_here';

// Initialize the API client
const api = new openai.AuthenticatedApiClient(OPENAI_API_KEY);

// Set up the web server
const app = express();
const port = 3000;

// Serve the home page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Funny Mean Response Generator</title>
      </head>
      <body>
        <h1>Funny Mean Response Generator</h1>
        <form action="/generate" method="POST">
          <label for="company">Enter a company name:</label>
          <input type="text" id="company" name="company" required>
          <button type="submit">Generate</button>
        </form>
      </body>
    </html>
  `);
});

// Handle the generation request
app.post('/generate', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    // Get the company name from the request body
    const company = req.body.company;

    // Generate a response using the OpenAI GPT API
    const response = await api.completions.create({
      engine: 'text-davinci-002',
      prompt: `What's the deal with ${company}?`,
      max_tokens: 64,
      n: 1,
      stop: '\n',
    });

    // Send the response back to the user
    res.send(`
      <html>
        <head>
          <title>Funny Mean Response Generator</title>
        </head>
        <body>
          <h1>Funny Mean Response Generator</h1>
          <p>Here's what I think of ${company}:</p>
          <blockquote>${response.choices[0].text.trim()}</blockquote>
          <form action="/" method="GET">
            <button type="submit">Back</button>
          </form>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Oops, something went wrong!');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
