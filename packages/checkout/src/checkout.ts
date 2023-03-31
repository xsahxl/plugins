import { Logger, parseRef, fs, lodash } from '@serverless-cd/core';
import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as os from 'os';
import { IConfig } from './types';
import { stringify } from './utils';
const { replace, get } = lodash;
const debug = require('@serverless-cd/debug')('serverless-cd:checkout');

class Checkout {
  private logger: Logger;
  private git: SimpleGit;
  private existing: boolean = false;
  constructor(private config: IConfig) {
    this.logger = (config.logger || console) as Logger;
    const exec_dir = config.exec_dir || os.tmpdir();
    this.config.exec_dir = path.isAbsolute(exec_dir) ? exec_dir : path.join(process.cwd(), exec_dir);
    debug(`config: ${stringify(config)}`);
    this.logger.info(`exec_dir: ${this.config.exec_dir}`);
    fs.ensureDirSync(this.config.exec_dir);
    this.git = simpleGit(this.config.exec_dir);
  }
  async run() {
    const { clone_url, exec_dir } = this.config;
    this.existing = fs.existsSync(path.join(exec_dir as string, '.git'));
    this.logger.info(`Existing: ${this.existing}`);
    if (this.existing) {
      this.logger.info(`Updating ${clone_url} into ${exec_dir}`);
      await this.git.remote(['set-url', 'origin', this.getclone_url() as string]);
      await this.checkout();
    } else {
      await this.clone();
    }
  }
  private getclone_url() {
    const { provider, owner, clone_url, token } = this.config;
    const newUrl = replace(clone_url, /http(s)?:\/\//, '');
    if (provider === 'gitee') {
      return `https://${owner}:${token}@${newUrl}`;
    }
    if (provider === 'github') {
      return `https://${token}@${newUrl}`;
    }
    if (provider === 'gitlab') {
      const protocol = clone_url.startsWith('https') ? 'https' : 'http';
      return `${protocol}${owner}:${token}@${newUrl}`;
    }
    if (provider === 'codeup') {
      return `https://${owner}:${token}@${newUrl}`;
    }
  }
  private async clone() {
    const { clone_url, exec_dir } = this.config;
    this.logger.info(`Cloning ${clone_url} into ${exec_dir}`);
    const newclone_url = this.getclone_url() as string;
    const inputs = this.checkInputs();
    this.logger.info(`Clone params: ${stringify(inputs)}`);
    if (inputs.noArgs) {
      await this.git.clone(newclone_url, exec_dir as string, ['--depth', '1']);
    } else {
      await this.git.clone(newclone_url, exec_dir as string, ['--no-checkout']);
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
