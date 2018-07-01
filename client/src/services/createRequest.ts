import axios, { AxiosInstance } from 'axios';

import { auth, IAuthError, IUser } from 'presentations/utils/auth';

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
