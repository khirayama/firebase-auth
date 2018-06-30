// tslint:disable
import { ILayout } from 'presentations/application/Layout';
import { logger } from 'presentations/utils/logger';
import { auth } from 'presentations/utils/auth';

declare var firebase: any;

export interface ISigninPage extends ILayout {
  test: string;
}

window.addEventListener('DOMContentLoaded', () => {
  logger.info(`Start Signin at ${new Date().toString()}.`);

  document.querySelector('.signin-form').addEventListener('submit', (event: Event) => {
    event.preventDefault();
    const emailElement: HTMLElement = (event.currentTarget as HTMLElement).querySelector('input[name=email]');
    const passwordElement: HTMLElement = (event.currentTarget as HTMLElement).querySelector('input[name=password]');
    const email: string = (emailElement as HTMLInputElement).value;
    const password: string = (passwordElement as HTMLInputElement).value;

    auth
      .signupNewUser({
        email,
        password,
      })
      .catch((res: any) => {
        if (res.status === 400 && res.data.error.message === 'EMAIL_EXISTS') {
          auth
            .verifyPassword({
              email,
              password,
            })
            .then((res: any) => {
              auth.saveUser({
                idToken: res.idToken,
                refreshToken: res.refreshToken,
              });
            });
        }
      });
  });
});
