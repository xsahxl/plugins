import { lodash } from '@serverless-cd/core';
import * as path from 'path';
import Engine from '@serverless-cd/engine';
const logPrefix = path.join(__dirname, 'logs');
const { get } = lodash;

test('run方法是否执行成功', async () => {
  const steps = [
    {
      uses: path.join(__dirname, '..', 'src'),
      inputs: {
        config: {
          service: 'qq',
          secure: true,
          auth: {
            user: "${{env.sender}}",
            // 这里密码不是qq密码，是你设置的smtp授权码
            // 获取qq授权码请看:https://jingyan.baidu.com/article/6079ad0eb14aaa28fe86db5a.html
            pass: process.env.pass,
          },
        },
        mail: {
          from: '"test" ${{env.sender}}', // 你到qq邮箱地址
          to: "${{env.receiver}}", // 接受人,可以群发填写多个逗号分隔
          subject: 'Hello', // 主题名(邮件名)
          html: '<b>Hello world?</b>',
        },
      },
      env: { sender: process.env.sender, receiver: process.env.receiver },
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
  console.log(context);
  expect(get(context, 'status')).toBe('success');
});
