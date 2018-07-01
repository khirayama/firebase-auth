//tslint:disable:no-console no-any
export const logger: {
  info(...args: any[]): void;
  warn(...args: any[]): void;
} = {
  info: (...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(...args);
    }
  },
  warn: (...args: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(...args);
    }
  },
};
