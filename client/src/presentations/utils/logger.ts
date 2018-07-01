//tslint:disable:no-console no-any
export const logger: {
  info(...args: any[]): void;
  warn(...args: any[]): void;
} = {
  info: (...args: any[]): void => {
    console.log(...args);
  },
  warn: (...args: any[]): void => {
    console.warn(...args);
  },
};
