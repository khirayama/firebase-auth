// tslint:disable:no-any
import axios, { AxiosError, AxiosInstance } from 'axios';

import { logger } from 'presentations/utils/logger';
import { config } from 'secrets/config';

interface IAuthError {
  status: number;
  data: any;
}

type signDataType = {
  email: string;
  password: string;
};

const FIREBASE_URL: string = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';

function parseError(err: AxiosError): IAuthError {
  const status: number | null = err.response ? err.response.status : null;
  const data: string | null = err.response ? err.response.data : null;

  const result: IAuthError = {
    status,
    data,
  };
  logger.warn(status, data);

  return result;
}

export const auth: {
  req: AxiosInstance;
  saveUser(user: { [key: string]: string }): void;
  loadUser(): { [key: string]: string };
  signupNewUser(data: signDataType): Promise<void>;
  verifyPassword(data: signDataType): Promise<void>;
} = {
  req: axios.create({
    baseURL: FIREBASE_URL,
  }),
  saveUser: (user: { [key: string]: string }): void => {
    window.localStorage.setItem('__user', JSON.stringify(user));
  },
  loadUser: (): { [key: string]: string } => {
    const res: string = window.localStorage.getItem('__user');

    return <{ [key: string]: string }>JSON.parse(res);
  },
  signupNewUser: (data: signDataType): Promise<void> => {
    return new Promise(
      (resolve: any, reject: any): void => {
        auth.req
          .post(`/signupNewUser?key=${config.apiKey}`, {
            ...data,
            returnSecureToken: true,
          })
          .then((res: any) => {
            resolve(res.data);
          })
          .catch((err: AxiosError) => {
            const authError: IAuthError = parseError(err);
            reject(authError);
          });
      },
    );
  },
  verifyPassword: (data: signDataType): Promise<any> => {
    return new Promise(
      (resolve: any, reject: any): void => {
        auth.req
          .post(`/verifyPassword?key=${config.apiKey}`, {
            ...data,
            returnSecureToken: true,
          })
          .then((res: any) => {
            resolve(res.data);
          })
          .catch((err: AxiosError) => {
            const authError: IAuthError = parseError(err);
            reject(authError);
          });
      },
    );
  },
};
