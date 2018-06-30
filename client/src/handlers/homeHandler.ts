import * as express from 'express';

import { IHomePage } from 'presentations/pages/Home';
import { config } from 'secrets/config';

export function homeHandler(req: express.Request, res: express.Response): void {
  const props: IHomePage = {
    lang: 'ja',
    title: 'title',
    test: 'test',
  };

  res.render('pages/Home', { props });
}
