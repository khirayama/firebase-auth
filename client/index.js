const express = require('express');

const app = express();

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
};
const email = 'example@test.com';
const password = '1234example';

app.get('/signup', (req, res) => {
  res.send(`
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase-auth.js"></script>
<h1>Signup</h1>
<div class="signup-button">SIGN UP</div>
<script>
console.log('Start app at ${new Date().toString()}.');
const config = ${JSON.stringify(config)};
firebase.initializeApp(config);
document.querySelector('.signup-button').addEventListener('click', () => {
  firebase.auth().createUserWithEmailAndPassword('${email}', '${password}').then(res => {
    localStorage.setItem('jwt', res.qa)
    window.location.href = '/';
  }).catch(error => {
    firebase.auth().signInWithEmailAndPassword('${email}', '${password}').then(res => {
      localStorage.setItem('jwt', res.qa)
      window.location.href = '/';
    }, err => {
      alert(err.message)
    });
  });
});
</script>
  `);
});
app.get('/signin', (req, res) => {
  res.send(`
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase-auth.js"></script>
<h1>Signin</h1>
<div class="signin-button">SIGN IN</div>
<script>
console.log('Start app at ${new Date().toString()}.');
const config = ${JSON.stringify(config)};
firebase.initializeApp(config);
document.querySelector('.signin-button').addEventListener('click', () => {
  firebase.auth().signInWithEmailAndPassword('${email}', '${password}').then(res => {
    localStorage.setItem('jwt', res.qa)
    window.location.href = '/';
  }, err => {
    alert(err.message)
  });
});
</script>
  `);
});
app.get('/', (req, res) => {
  res.send(`
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/4.12.1/firebase-auth.js"></script>
<h1>Private</h1>
<div class="signout-button">SIGN OUT</div>
<script>
console.log('Start app at ${new Date().toString()}.');
const config = ${JSON.stringify(config)};
firebase.initializeApp(config);
window.fetch('http://localhost:3001/public', {
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
window.fetch('http://localhost:3001/private?jwt=' + localStorage.getItem('jwt'), {
  method: 'GET',
  mode: 'cors',
  credentials: 'include',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
document.querySelector('.signout-button').addEventListener('click', () => {
  firebase.auth().signOut().then(() => {
    localStorage.removeItem('jwt')
    window.location.href = '/signin';
  });
});
</script>
  `);
});

app.listen(3000);
