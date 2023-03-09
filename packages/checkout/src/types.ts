import { Logger } from '@serverless-cd/core';

export type IProvider = 'github' | 'gitee' | 'gitlab' | 'codeup';

export interface IConfig {
  token: string;
  provider: IProvider;
  owner: string;
  cloneUrl: string;
  logger?: Logger;
  execDir?: string;
  ref?: string;
  commit?: string;
}
