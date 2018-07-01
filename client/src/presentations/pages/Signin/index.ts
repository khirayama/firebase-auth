import { ILayout } from 'presentations/application/Layout';
import { auth, IAuthError, IUser } from 'presentations/utils/auth';
import { logger } from 'presentations/utils/logger';

export interface ISigninPage extends ILayout {
  test: string;
}

window.addEventListener('DOMContentLoaded', () => {
  logger.info(`Start Signin at ${new Date().toString()}.`);

  document.querySelector('.signin-form').addEventListener('submit', (event: Event) => {
    event.preventDefault();
    const emailElement: HTMLElement = (<HTMLElement>event.currentTarget).querySelector('input[name=email]');
    const passwordElement: HTMLElement = (<HTMLElement>event.currentTarget).querySelector('input[name=password]');
    const email: string = (<HTMLInputElement>emailElement).value;
    const password: string = (<HTMLInputElement>passwordElement).value;

    (auth.isSignin()
      ? auth.setAccountInfo({
          email,
          password,
        })
      : auth.signupNewUser({
          email,
          password,
        })
    )
      .then(
        (user: IUser): void => {
          window.location.href = '/';
        },
      )
      .catch((err: IAuthError) => {
        if (err.status === 400 && err.data.error.message === 'EMAIL_EXISTS') {
          auth
            .verifyPassword({
              email,
              password,
            })
            .then((res: IUser) => {
              window.location.href = '/';
            });
        }
      });
  });
});
