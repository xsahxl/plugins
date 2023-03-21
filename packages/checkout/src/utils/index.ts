import { lodash } from '@serverless-cd/core';
import flatted from 'flatted';

const { omit } = lodash;

export const stringify = (value: any) => {
  try {
    return JSON.stringify(omit(value, ['logger']));
  } catch (error) {
    return flatted.stringify(value);
  }
};
