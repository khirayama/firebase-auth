import { ILayout } from 'presentations/application/Layout';
import { logger } from 'presentations/utils/logger';
import { config } from 'secrets/config';
import { sampleService } from 'services/sampleService';

export interface IHomePage extends ILayout {
  test: string;
}

window.addEventListener('DOMContentLoaded', () => {
  logger.info(`Start HomePage at ${new Date().toString()}.`);

  sampleService.public();
  sampleService.private();
});
