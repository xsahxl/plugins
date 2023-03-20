import { Logger, parseRef, fs, lodash } from '@serverless-cd/core';
import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import { IConfig } from './types';
const { replace, get } = lodash;
const debug = require('debug')('serverless-cd:checkout');

class Checkout {
  private logger: Logger;
  private git: SimpleGit;
  private existing: boolean = false;
  constructor(private config: IConfig) {
    this.logger = (config.logger || console) as Logger;
    const execDir = config.execDir || os.tmpdir();
    this.config.execDir = path.isAbsolute(execDir) ? execDir : path.join(process.cwd(), execDir);
    debug(`config: ${JSON.stringify(this.config, null, 2)}`);
    this.logger.info(`execDir: ${this.config.execDir}`);
    fs.ensureDirSync(this.config.execDir);
    this.git = simpleGit(this.config.execDir);
  }
  async run() {
    const { cloneUrl, execDir } = this.config;
    this.existing = fs.existsSync(path.join(execDir as string, '.git'));
    this.logger.info(`Existing: ${this.existing}`);
    if (this.existing) {
      this.logger.info(`Updating ${cloneUrl} into ${execDir}`);
      await this.git.remote(['set-url', 'origin', this.getCloneUrl() as string]);
      await this.checkout();
    } else {
      await this.clone();
    }
  }
  private getCloneUrl() {
    const { provider, owner, cloneUrl, token } = this.config;
    const newUrl = replace(cloneUrl, /http(s)?:\/\//, '');
    if (provider === 'gitee') {
      return `https://${owner}:${token}@${newUrl}`;
    }
    if (provider === 'github') {
      return `https://${token}@${newUrl}`;
    }
    if (provider === 'gitlab') {
      const protocol = cloneUrl.startsWith('https') ? 'https' : 'http';
      return `${protocol}${owner}:${token}@${newUrl}`;
    }
    if (provider === 'codeup') {
      return `https://${owner}:${token}@${newUrl}`;
    }
  }
  private async clone() {
    const { cloneUrl, execDir } = this.config;
    this.logger.info(`Cloning ${cloneUrl} into ${execDir}`);
    const newCloneUrl = this.getCloneUrl() as string;
    const inputs = this.checkInputs();
    this.logger.info(`Clone params: ${JSON.stringify(inputs)}`);
    if (inputs.noArgs) {
      await this.git.clone(newCloneUrl, execDir as string, ['--depth', '1']);
    } else {
      await this.git.clone(newCloneUrl, execDir as string, ['--no-checkout']);
      await this.checkout();
    }
    this.logger.info('Cloned successfully');
  }
  private async checkout() {
    const { tag, branch, commit } = this.checkInputs() as any;
    if (tag) {
      this.logger.info(`Checking out tag ${tag}`);
      await this.git.checkout(tag, ['--force']);
      commit && (await this.git.reset(['--hard', commit]));
    } else if (branch && commit) {
      this.logger.info(`Checking out branch ${branch} and commit ${commit}`);
      await this.git.checkout(['--force', '-B', branch, commit]);
    } else if (branch) {
      this.logger.info(`Checking out branch ${branch}`);
      await this.git.checkout(['--force', '-B', branch]);
    } else if (commit) {
      this.logger.info(`Checking out commit ${commit}`);
      await this.git.checkout(['--force', commit]);
    }
    const res = await this.git.log(['--no-color', '-n', '1', "--format='HEAD is now at %h %s'"]);
    this.logger.info(get(res, 'latest.hash'));
  }
  private checkInputs() {
    const { commit, ref = '' } = this.config;
    if (ref) {
      const { type, value } = parseRef(ref);
      if (type === 'tag') {
        return { tag: value, commit };
      }
      if (type === 'branch') {
        return { branch: value, commit };
      }
    }
    if (commit) {
      return { commit };
    }
    return { noArgs: true };
  }
}

export default Checkout;
