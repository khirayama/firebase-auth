// tslint:disable
import { ILayout } from 'presentations/application/Layout';
import { logger } from 'presentations/utils/logger';
import { config } from 'secrets/config';

declare var firebase: any;

export interface IHomePage extends ILayout {
  test: string;
}

window.addEventListener('DOMContentLoaded', () => {
  logger.info(`Start HomePage at ${new Date().toString()}.`);

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
  window.fetch('http://localhost:3001/private?jwt=' + localStorage.getItem('__jwt'), {
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
      localStorage.removeItem('__jwt')
      window.location.href = '/signin';
    });
  });
});
