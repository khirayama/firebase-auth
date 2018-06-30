import * as path from 'path';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';

import { homeHandler } from 'handlers/homeHandler';
import { signinHandler } from 'handlers/signinHandler';
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

app.get('/', homeHandler).get('/signin', signinHandler);

app.listen(3000, () => {
  // tslint:disable-next-line:no-console
  console.log('Start app at http://localhost:3000.');
});
