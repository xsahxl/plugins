# send-email 
发送Email邮件

## 简单使用
```
- use: @serverless-cd/send-email
  inputs: 
    config: 
      service: 'qq',
      auth:
        user: '751734566@qq.com',
        // 这里密码不是qq密码，是你设置的smtp授权码
        // 获取qq授权码请看:https://jingyan.baidu.com/article/6079ad0eb14aaa28fe86db5a.html
        pass: 'xxxxxxxx',
    mail:
      from: '"test" <xxxxxx@qq.com>',  // 你到qq邮箱地址
      to: 'xxxx@qq.com', // 接受人,可以群发填写多个逗号分隔
      subject: 'Hello', // 主题名(邮件名)
      html: '<b>Hello world ${git.ref} ${args.name}?</b>' // html
```


# 参考资料
https://nodemailer.com/smtp/well-known/