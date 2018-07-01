// tslint:disable:no-any
import { auth } from 'presentations/utils/auth';
import { logger } from 'presentations/utils/logger';
import { createRequest } from 'services/createRequest';

function handleError(err: any): Promise<any> {
  return new Promise((resolve: any, reject: any): void => {
    if (err.status === 401) {
      logger.info('Refresh token.');
      logger.warn('Please redo comment out');
      auth.refreshToken().then(() => {
        resolve();
      }).catch(() => {
        reject();
      });
    } else {
      resolve();
    }
  });
}

export const sampleService: {
  public(): Promise<any>;
  private(): Promise<any>;
} = {
  public: (): Promise<any> => {
    return new Promise((resolve: any, reject: any): void => {
      createRequest('/').get('/public-resources').then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => {
        handleError(err).then(reject);
      });
    });
  },
  private: (): Promise<any> => {
    return new Promise((resolve: any, reject: any): void => {
      createRequest('/').get('/private-resources').then((res: any) => {
        resolve(res.data);
      }).catch((err: any) => {
        handleError(err.response).then(() => {
          sampleService.private();
        });
      });
    });
  },
};
