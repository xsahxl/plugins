## Serverless-CD 应用程序
1. 钉钉群通知: ding-talk

## 开发注意事项

- 目前发现node版本14.x存在问题，可以安装16.x版本进行测试
- 根路径下 npm i 进行安装 （删除node_modules和package-lock.json文件）
- 根路径下 npm run build 对每个package进行打包
- npm run test 对所有package进行测试
- npm run test-core 对指定package进行测试 
    - test-core: "jest --testTimeout 10000 packages/core"

## 发布注意事项

- 需要在被发布包的 package.json 文件中添加
```
{
    "publishConfig": {
        "access": "public"
    }
}
```