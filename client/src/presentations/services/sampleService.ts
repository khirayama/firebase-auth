import { AxiosInstance } from 'axios';
import { create, retry } from 'presentations/services/utils';

export interface IMessage {
  message: string;
}

export const sampleService: {
  req(): AxiosInstance;
  public(): Promise<IMessage>;
  private(): Promise<IMessage>;
} = {
  req: create('/'),
  public: (): Promise<IMessage> => {
    return retry(() => sampleService.req().get('/public-resources'));
  },
  private: (): Promise<IMessage> => {
    return retry(() => sampleService.req().get('/private-resources'));
  },
};
