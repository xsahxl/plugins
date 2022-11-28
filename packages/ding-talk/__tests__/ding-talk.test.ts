import Engine from '@serverless-cd/engine';
import path from 'path';
import fs from 'fs-extra';
import { TYPE } from '../src/ding-talk';

require('dotenv').config({ path: path.join(__dirname, '.env') });
const logPrefix = path.join(__dirname, 'logs');
const uses = path.join(__dirname, '..', 'src');
const webhook = 'https://oapi.dingtalk.com/robot/send?access_token=${{ secrets.access_token }}';
const secrets = {
  access_token: process.env.access_token,
};
describe('ding talk', () => {
  beforeAll(() => {
    try {
      fs.rmdirSync(logPrefix);
    } catch (err) {}
  });

  test(TYPE.TEXT, async () => {
    const steps = [
      {
        uses,
        inputs: {
          webhook,
          msgtype: TYPE.TEXT,
          at: { isAtAll: true },
          payload: {
            "content": "我就是我, @XXX 是不一样的烟火",
          }
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: { secrets },
    });
    await engine.start();
  });
  
  test(TYPE.LINK, async () => {
    const steps = [
      {
        uses,
        inputs: {
          webhook,
          msgtype: TYPE.LINK,
          payload: {
            text: "我们的中国", 
            title: "title", 
            picUrl: "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png", 
            messageUrl: "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png"
          }
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: { secrets },
    });
    await engine.start();
  });
  
  test(TYPE.MARKDOWN, async () => {
    const steps = [
      {
        uses,
        inputs: {
          webhook,
          msgtype: TYPE.MARKDOWN,
          payload: {
            title:"我们杭州天气",
            text: "#### 杭州天气 @150XXXXXXXX \n > 9度，西北风1级，空气良89，相对温度73%\n > ![screenshot](https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png)\n > ###### 10点20分发布 [天气](https://www.dingtalk.com) \n"
          }
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: { secrets },
    });
    await engine.start();
  });

  test(TYPE.ACTION_CARD, async () => {
    const steps = [
      {
        uses,
        inputs: {
          webhook,
          msgtype: TYPE.ACTION_CARD,
          payload: {
            "title": "我们乔布斯 20 年前想打造一间苹果咖啡厅，而它正是 Apple Store 的前身", 
            "text": "![screenshot](https://gw.alicdn.com/tfs/TB1ut3xxbsrBKNjSZFpXXcXhFXa-846-786.png) \n ### 乔布斯 20 年前想打造的苹果咖啡厅 \n Apple Store 的设计正从原来满满的科技感走向生活化，而其生活化的走向其实可以追溯到 20 年前苹果一个建立咖啡馆的计划", 
            "btnOrientation": "0", 
            "singleTitle" : "阅读全文",
            "singleURL" : "https://www.dingtalk.com/"
          }
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: { secrets },
    });
    await engine.start();
  });

  test(TYPE.FEED_CARD, async () => {
    const steps = [
      {
        uses,
        inputs: {
          webhook,
          msgtype: TYPE.FEED_CARD,
          payload: {
            "links": [
              {
                "title": "我时代的火车向前开1", 
                "messageURL": "https://www.dingtalk.com/", 
                "picURL": "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png"
              },
              {
                "title": "时代的火车向前开2", 
                "messageURL": "https://www.dingtalk.com/", 
                "picURL": "https://img.alicdn.com/tfs/TB1NwmBEL9TBuNjy1zbXXXpepXa-2400-1218.png"
              }
            ]
          }
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: { secrets },
    });
    await engine.start();
  });

  test('art-template', async () => {
    const steps = [
      {
        uses,
        env: { template: '不一样的' },
        inputs: {
          webhook,
          msgtype: TYPE.TEXT,
          at: { isAtAll: true },
          payload: {
            "content": "我就是我, @XXX ${{env.template}} ${{ secrets.text }}",
          }
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: { secrets: { ...secrets, text: 'template' } },
    });
    await engine.start();
  });

  test.only('sign', async () => {
    const steps = [
      {
        uses,
        env: { template: '不一样的' },
        inputs: {
          webhook,
          msgtype: TYPE.TEXT,
          at: { isAtAll: true },
          secret: process.env.sign,
          payload: {
            "content": "我就是我, @XXX ${{env.template}} ${{ secrets.text }}",
          }
        },
      },
    ];
    const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: { secrets: { access_token: process.env.sign_access_token, text: 'sign' } },
    });
    await engine.start();
  })
})
