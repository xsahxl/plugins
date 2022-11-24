import { lodash } from '@serverless-cd/core';
import * as path from 'path';
import Engine from '@serverless-cd/engine';
const logPrefix = path.join(__dirname, 'logs');
const { get } = lodash;

test('run方法是否执行成功', async () => {
  const steps = [
    {
      uses: path.join(__dirname, '..', 'src'),
      inputs: { name: 'xiaoming', age: 20 },
      id: 'cdn-cache',
    },
    { run: 'echo "hello world"' },
  ];
  const engine = new Engine({ steps, logConfig: { logPrefix } });
  const context = await engine.start();
  // console.log(JSON.stringify(context, null, 2));
  expect(get(context, 'status')).toBe('success');
});
