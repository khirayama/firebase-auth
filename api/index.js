const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const serviceAccount = require('./serviceAccountKey');

let publicKeys = null;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function authHandler(req, res, next) {
  const authorization = req.headers.authorization || '';
  const jwtToken = authorization.replace('Bearer ', '');
  const fullDecodedToken = jwt.decode(jwtToken, {
    complete: true,
  });
  jwt.verify(jwtToken, publicKeys[fullDecodedToken.header.kid], {
    algorithms: [fullDecodedToken.header.alg],
  }, (err, decodedToken) => {
    if (err) {
      res.status(401).json(err);
      return;
    } else {
      req.decodedToken = decodedToken;
      next();
    }
  });
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/public-resources', (req, res) => {
  res.json({
    message: 'public',
  });
}).get('/private-resources', authHandler, (req, res) => {
  res.json({
    message: 'private',
  });
});

axios.get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com').then((res) => {
  publicKeys = res.data;
  app.listen(3001);
});
