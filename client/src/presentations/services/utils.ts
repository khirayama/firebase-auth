// tslint:disable:no-any
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { auth, IAuthError, IUser } from 'presentations/utils/auth';
import { logger } from 'presentations/utils/logger';

// tslint:disable-next-line:no-http-string
const API_SERVER_HOST: string = process.env.API_SERVER_HOST || 'http://127.0.0.1:3001';

export function create(baseURL: string): () => AxiosInstance {
  return (): AxiosInstance => {
    const user: IUser = auth.loadUser();

    return axios.create({
      baseURL: API_SERVER_HOST + baseURL,
      headers: {
        Authorization: `Bearer ${user.idToken}`,
      },
    });
  };
}

export function retry(request: any): Promise<any> {
  return new Promise(
    (resolve: any, reject: any): void => {
      request()
        .then(resolve)
        .catch((err: AxiosError) => {
          if (err.response.status === 401) {
            logger.warn('Retry with refreshing token');
            auth.refreshToken().then(() => {
              request()
                .then(resolve)
                .catch(reject);
            });
          } else {
            reject(err);
          }
        });
    },
  );
}
