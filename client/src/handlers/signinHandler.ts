import * as express from 'express';

import { ISigninPage } from 'presentations/pages/Signin';
import { config } from 'secrets/config';

export function signinHandler(req: express.Request, res: express.Response): void {
  const props: ISigninPage = {
    lang: 'ja',
    title: 'title',
    test: 'test',
  };

  res.render('pages/Signin', { props });
}
