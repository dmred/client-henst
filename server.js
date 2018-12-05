const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const Asyncmongodb = require('./mong');
require('dotenv').config();
const URL = process.env.DB_URI;
const DB_NAME = process.env.DB_NAME;
const COLLECTION_LOGIN = process.env.DB_COLLECTION_LOGIN; 
const COLLECTION_DATA = process.env.DB_COLLECTION_DATA;

const amng = new Asyncmongodb({ dbName: DB_NAME, uri: URL });

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/hello', (req, res) => {
  res.send({ express: 'Hello From Express' });
});

app.get('/api/getFollowers', async (req, res) => {
  await amng.connect();
  console.log(req.query.username);
  const lel = await amng.find({ collection: COLLECTION_DATA, where: { username: req.query.username } });
  console.log(lel[0].followersAdded);
  res.send(`Followers added via Henst: ${lel[0].followersAdded}`)
  await amng.disconnect();
})

app.post('/api/world', (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`,
  );
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
