import { AxiosInstance } from 'axios';
import { createRequest, req } from 'services/utils';

interface IMessage {
  message: string;
}

export const sampleService: {
  req(): AxiosInstance;
  public(): Promise<IMessage>;
  private(): Promise<IMessage>;
} = {
  req: (): AxiosInstance => createRequest('/'),
  public: (): Promise<IMessage> => {
    return req(() => sampleService.req().get('/public-resources'));
  },
  private: (): Promise<IMessage> => {
    return req(() => sampleService.req().get('/private-resources'));
  },
};
