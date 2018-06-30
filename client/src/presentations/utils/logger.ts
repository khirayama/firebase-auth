//tslint:disable:no-console

export const logger: {
  info(...args: string[]): void;
} = {
  info: (...args: string[]): void => {
    console.log(...args);
  },
};
