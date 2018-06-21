const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/public', (req, res) => {
  res.json({
    message: 'public',
  });
}).get('/private', (req, res) => {
  const jwt = req.query.jwt || '';
  admin.auth().verifyIdToken(jwt).then((decodedToken) => {
    res.json({
      message: 'private',
    });
  }).catch((error) => {
    res.status(401).json({
      message: error,
    });
  });
});

app.listen(3001);
