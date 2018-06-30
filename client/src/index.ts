import * as path from 'path';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

import { homeHandler } from 'handlers/homeHandler';
import { config } from 'secrets/config';

const app: express.App = express();

const basedir: string = path.join(__dirname, 'presentations');
app.locals.basedir = basedir;
app
  .set('views', basedir)
  .set('view engine', 'pug')
  .use(compression({ level: 9 }))
  .use(express.static(path.join(__dirname, 'assets')))
  .use(express.static(path.join(__dirname, 'public')))
  .use(cookieParser());

const email: string = 'example@test.com';
const password: string = '1234example';

app.get('/signup', (req: express.Request, res: express.Response) => {
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
    localStorage.setItem('__jwt', res.qa)
    window.location.href = '/';
  }).catch(error => {
    firebase.auth().signInWithEmailAndPassword('${email}', '${password}').then(res => {
      localStorage.setItem('__jwt', res.qa)
      window.location.href = '/';
    }, err => {
      alert(err.message)
    });
  });
});
</script>
  `);
});

app.get('/signin', (req: express.Request, res: express.Response) => {
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
    localStorage.setItem('__jwt', res.qa)
    window.location.href = '/';
  }, err => {
    alert(err.message)
  });
});
</script>
  `);
});

app.get('/', homeHandler);

app.listen(3000, () => {
  // tslint:disable-next-line:no-console
  console.log('Start app at http://localhost:3000.');
});
