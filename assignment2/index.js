const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// Route to handle POST requests on localhost
app.post('/', (req, res) => {
  // Check if the payload contains the "str" property
  const payloadStr = req.body.str;

  if (!payloadStr) {
    return res.status(400).send('Bad Request: Payload must contain "str" property');
  }

  // Use regex to count words
  const wordCount = payloadStr.trim().split(/\s+/).length;

  // Check if there are at least 8 words
  if (wordCount >= 8) {
    return res.status(200).send('OK: At least 8 words');
  } else {
    return res.status(406).send('Not Acceptable: Less than 8 words');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
