// tslint:disable:no-any
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { logger } from 'presentations/utils/logger';
import { config } from 'secrets/config';

export interface IAuthError {
  status: number;
  data: any;
}

export interface IUser {
  idToken: string;
  refreshToken: string;
}

export interface IUserResponse {
  id_token: string;
  refresh_token: string;
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
  isSignin(): boolean;
  saveUser(user: IUser): void;
  loadUser(): IUser;
  signupNewUser(data?: signDataType): Promise<IUser>;
  verifyPassword(data: signDataType): Promise<IUser>;
  refreshToken(): Promise<IUser>;
} = {
  req: axios.create({
    baseURL: FIREBASE_URL,
  }),
  isSignin: (): boolean => {
    return !!auth.loadUser();
  },
  saveUser: (user: IUser): void => {
    window.localStorage.setItem('__user', JSON.stringify(user));
  },
  loadUser: (): IUser => {
    const res: string = window.localStorage.getItem('__user');

    return <IUser>JSON.parse(res);
  },
  signupNewUser: (data?: signDataType): Promise<IUser> => {
    return new Promise(
      (resolve: any, reject: any): void => {
        auth.req
          .post(`/signupNewUser?key=${config.apiKey}`, {
            ...data,
            returnSecureToken: true,
          })
          .then((res: AxiosResponse<IUser>) => {
            const newUser: IUser = {
              idToken: res.data.idToken,
              refreshToken: res.data.refreshToken,
            };
            auth.saveUser(newUser);
            resolve(newUser);
          })
          .catch((err: AxiosError) => {
            const authError: IAuthError = parseError(err);
            reject(authError);
          });
      },
    );
  },
  verifyPassword: (data: signDataType): Promise<IUser> => {
    return new Promise(
      (resolve: any, reject: any): void => {
        auth.req
          .post(`/verifyPassword?key=${config.apiKey}`, {
            ...data,
            returnSecureToken: true,
          })
          .then((res: AxiosResponse<IUser>) => {
            const newUser: IUser = {
              idToken: res.data.idToken,
              refreshToken: res.data.refreshToken,
            };
            auth.saveUser(newUser);
            resolve(newUser);
          })
          .catch((err: AxiosError) => {
            const authError: IAuthError = parseError(err);
            reject(authError);
          });
      },
    );
  },
  refreshToken: (): Promise<IUser> => {
    const user: IUser = auth.loadUser();

    return new Promise(
      (resolve: any, reject: any): void => {
        auth.req
          .post(`https://securetoken.googleapis.com/v1/token?key=${config.apiKey}`, {
            grant_type: 'refresh_token',
            refresh_token: user.refreshToken,
          })
          .then((res: AxiosResponse<IUserResponse>) => {
            const newUser: IUser = {
              idToken: res.data.id_token,
              refreshToken: res.data.refresh_token,
            };
            auth.saveUser(newUser);
            resolve(newUser);
          })
          .catch((err: AxiosError) => {
            const authError: IAuthError = parseError(err);
            reject(authError);
          });
      },
    );
  },
};
