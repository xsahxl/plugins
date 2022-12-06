import { lodash } from '@serverless-cd/core';
import * as path from 'path';
import Engine from '@serverless-cd/engine';
const logPrefix = path.join(__dirname, 'logs');
const { get } = lodash;

test('run方法是否执行成功', async () => {
  const steps = [
    {
      plugin: path.join(__dirname, '..', 'src'),
      inputs: { name: 'xiaoming', age: 20, a: '${{env.msg}}', b: '${{secrets.msg}}' },
      env: { msg: 'this is a env test' },
      id: 'cdn-cache',
    },
    { run: 'echo "hello world"' },
  ];
  const engine = new Engine({
    steps,
    logConfig: { logPrefix },
    inputs: { secrets: { msg: 'this is a secrets test' } },
  });
  const context = await engine.start();
  // console.log(JSON.stringify(context, null, 2));
  expect(get(context, 'status')).toBe('success');
});
