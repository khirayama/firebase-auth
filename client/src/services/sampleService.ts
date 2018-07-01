// tslint:disable:no-any
import axios, { AxiosInstance } from 'axios';
import { auth, IUser } from 'presentations/utils/auth';
import { logger } from 'presentations/utils/logger';
import { createRequest } from 'services/createRequest';

function req(request: any): any {
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

export const sampleService: {
  req(): AxiosInstance;
  public(): Promise<any>;
  private(): Promise<any>;
} = {
  req: (): AxiosInstance => createRequest('/'),
  public: (): Promise<any> => {
    return req(() => sampleService.req().get('/public-resources'));
  },
  private: (): Promise<any> => {
    return req(() => sampleService.req().get('/private-resources'));
  },
};
