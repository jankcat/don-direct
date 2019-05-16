const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);
const app = express();
app.use(cors({ origin: true }));

app.post('/', async (req, res) => {
  if (!req.body.quote) {
    res.status(400);
    res.send("Error: No quote provided.");
    return;
  }
  try {
    const newQuote = {
      quote: req.body.quote,
    };
    if (req.body.url) newQuote.url = req.body.url;
    if (req.body.context) newQuote.context = req.body.context;
    await db.collection('quotes').add(newQuote);
    res.send(`Inserted quote: ${newQuote.quote}`);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.send(`Error: ${e}`);
  }
});

exports.newQuote = functions.https.onRequest(app);
