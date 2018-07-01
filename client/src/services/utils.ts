// tslint:disable:no-any
import axios, { AxiosInstance } from 'axios';

import { auth, IAuthError, IUser } from 'presentations/utils/auth';
import { logger } from 'presentations/utils/logger';

// tslint:disable-next-line:no-http-string
const API_SERVER_HOST: string = process.env.API_SERVER_HOST || 'http://127.0.0.1:3001';

export function createRequest(baseURL: string): AxiosInstance {
  const user: IUser = auth.loadUser();

  return axios.create({
    baseURL: API_SERVER_HOST + baseURL,
    headers: {
      Authorization: `Bearer ${user.idToken}`,
    },
  });
}

export function req(request: any): any {
  return new Promise(
    (resolve: any, reject: any): void => {
      request()
        .then((res: any) => {
          resolve(res.data);
        })
        .catch((err: any) => {
          if (err.response.status === 401) {
            logger.warn('Retry with refreshing token');
            auth.refreshToken().then(() => {
              request()
                .then((res: any) => {
                  resolve(res.data);
                })
                .catch((err2: any) => {
                  reject(err2.response);
                });
            });
          } else {
            reject(err.response);
          }
        });
    },
  );
}
