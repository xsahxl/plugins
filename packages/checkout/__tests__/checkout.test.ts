import Engine from '@serverless-cd/engine';
import path from 'path';
import fs from 'fs-extra';
import { IProvider } from '../src/types';
import checkout from '../src';

require('dotenv').config({ path: path.join(__dirname, '.env') });
const logPrefix = path.join(__dirname, 'logs');
const plugin = path.join(__dirname, '..', 'src');
const execDir = path.join(__dirname, '_temp');

describe('仓库未初始化', () => {
  beforeAll(() => {
    fs.removeSync(execDir);
  });
  test('checkout no ref and commit', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'no-agrs'),
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref branch case', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-branch'),
          ref: 'refs/heads/test',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref branch and commit case', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-branch-and-commit'),
          ref: 'refs/heads/test',
          commit: '7ba9d158a0875969a51750345ec07616a912c301',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref tag case', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-tag'),
          ref: 'refs/tags/0.0.2',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout commit', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'commit'),
          commit: '3b763ea19e8e8a964e90e75962ccb8e0d68bdf46',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
});

describe('仓库已经初始化', () => {
  test('checkout no ref and commit', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'no-agrs'),
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref branch case', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-branch'),
          ref: 'refs/heads/test',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref branch and commit case', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-branch-and-commit'),
          ref: 'refs/heads/test',
          commit: '7ba9d158a0875969a51750345ec07616a912c301',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref tag case', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-tag'),
          ref: 'refs/tags/0.0.2',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout commit', async () => {
    const steps = [
      {
        plugin,
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'commit'),
          commit: '3b763ea19e8e8a964e90e75962ccb8e0d68bdf46',
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
});

describe('plugin inputs case', () => {
  beforeAll(() => {
    fs.removeSync(execDir);
  });
  test('checkout ref branch case', async () => {
    const steps = [
      {
        plugin,
        inputs: {
          ref: 'refs/heads/test',
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-branch'),
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref branch and commit case', async () => {
    const steps = [
      {
        plugin,
        inputs: {
          ref: 'refs/heads/test',
          commit: '7ba9d158a0875969a51750345ec07616a912c301',
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-branch-and-commit'),
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout ref tag case', async () => {
    const steps = [
      {
        plugin,
        inputs: {
          ref: 'refs/tags/0.0.2',
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'ref-with-tag'),
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
  test('checkout commit', async () => {
    const steps = [
      {
        plugin,
        inputs: {
          commit: '3b763ea19e8e8a964e90e75962ccb8e0d68bdf46',
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: process.env.TOKEN,
          provider: 'gitee' as IProvider,
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: path.join(execDir, 'commit'),
        },
      },
    });
    const res = await engine.start();
    expect(res.status).toBe('success');
  });
});

describe('use npm', () => {
  test('checkout ref branch case', async () => {
    await expect(
      checkout({
        token: process.env.TOKEN as string,
        provider: 'gitee' as IProvider,
        owner: 'shihuali',
        cloneUrl: 'https://gitee.com/shihuali/checkout.git',
        execDir: path.join(execDir, 'no-agrs-with-npm'),
        ref: 'refs/heads/test',
      }),
    ).resolves.not.toThrow();
  });
});

test.only('checkout for appcenter', async () => {
  const steps = [
    {
      plugin,
    },
  ];
  const engine = new Engine({
    cwd: path.join(execDir, 'app-center'),
    steps,
    logConfig: { logPrefix },
    inputs: {
      ctx: {
        data: {
          checkout: {
            branch: 'master',
            commit: '57f0153d92cfd1b445235a7763b2a799df1f42b2',
            message: 'Initialize by template start-springboot',
            provider: 'github',
            ref: '+57f0153d92cfd1b445235a7763b2a799df1f42b2:refs/remotes/origin/master',
            remote: `https://${process.env.APPCENTER_TOKEN}@github.com/zhaohang88/start-springboot-kzbp.git`,
            token: process.env.APPCENTER_TOKEN,
            userName: 'zhaohang88',
          },
        },
      },
    },
  });
  const res = await engine.start();
  expect(res.status).toBe('success');
});
