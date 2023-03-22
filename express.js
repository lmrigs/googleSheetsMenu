const express = require('express');
const helmet = require('helmet');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const port = 5400;

// Serve static files from the public directory
app.use(express.static('client'));
app.use(helmet());

const spreadsheetId = process.env.SPREADSHEET_ID;
const range = process.env.RANGE;

//When you store a private key in a .env file, you need to represent 
//newline characters as escaped newline characters (\n) because newlines 
//are not allowed in the .env file format. However, when you use the 
//private key to authenticate requests to the Google Sheets API, it needs 
//to contain actual newline characters instead of escaped newline characters.
const privateKey = process.env.PRIVATE_KEY.replace(/\\n/gm, '\n');

const auth = new google.auth.JWT(
  process.env.CLIENT_EMAIL,
  null,
  privateKey,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth });

app.get('/data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: range,
    });
    res.send(response.data.values);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});