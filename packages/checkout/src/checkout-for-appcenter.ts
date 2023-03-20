import { Logger, fs, lodash } from '@serverless-cd/core';
import simpleGit from 'simple-git';
const { get } = lodash;
const debug = require('debug')('serverless-cd:checkout');

interface IConfig {
  provider: string;
  token: string;
  remote: string;
  execDir: string;
  ref: string;
  branch?: string;
  commit?: string;
  logger?: Logger;
}

const checkoutForAppCenter = async (config: IConfig) => {
  const logger = config.logger || console;
  const { execDir, remote, token, branch, commit, provider, ref } = config;
  debug(`config: ${JSON.stringify(config, null, 2)}`);
  fs.ensureDirSync(execDir);
  const git = simpleGit(execDir);
  logger.info(`Git Init ${execDir}`);
  await git.init();
  logger.info(`Git remote add origin ${remote.replace(token, '********')}`);
  await git.addRemote('origin', remote);
  // gitlab 旧版本 git fetch 存在问题，拉取不了代码
  if (provider === 'self-gitlab' && branch && commit) {
    logger.info(`Git pull origin ${branch}`);
    await git.pull(`origin`, branch);
    logger.info(`Git reset --hard ${commit}`);
    await git.reset(['--hard', commit]);
  } else {
    logger.info(`Git fetch --depth=1 origin ${ref}`);
    await git.fetch(`origin`, ref, { '--depth': '1' });
    logger.info(`Git reset --hard FETCH_HEAD`);
    await git.reset(['--hard', 'FETCH_HEAD']);
  }
  const res = await git.log(['--no-color', '-n', '1', "--format='HEAD is now at %h %s'"]);
  logger.info(get(res, 'latest.hash'));
};

export default checkoutForAppCenter;
