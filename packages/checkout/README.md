
# 下载仓库代码(@serverless-cd/checkout)


## 基本使用

```yaml
- plugin: '@serverless-cd/checkout'
  inputs:
    # 用于下载仓库的个人访问令牌（https://github.com/settings/tokens）。
    token: ''

    # 支持下载的代码托管平台(github、gitee、gitlab、codeup)
    provider: ''

    # 仓库的克隆地址，比如：https://gitee.com/shihuali/checkout.git
    cloneUrl: ''

    # 仓库owner，比如cloneUrl为https://gitee.com/shihuali/checkout.git时，owner应为 shihuali
    owner: ''

    # 通过分支或者tag来下载仓库，比如：refs/heads/main 或者 refs/tags/v0.0.1
    ref: ''

    # 代码下载目录
    execDir: ''

    # 通过commit id来下载仓库
    commit: ''
```

## 推荐Engine调用方式

对于checkout插件而言，建议调用engine的时候注入checkout插件所需要的参数

```ts
 const engine = new Engine({
      cwd: __dirname,
      steps,
      logConfig: { logPrefix },
      inputs: {
        git: {
          token: 'xxx',
          provider: 'gitee',
          owner: 'shihuali',
          cloneUrl: 'https://gitee.com/shihuali/checkout.git',
          execDir: './checkout',
          ref: 'refs/heads/main',
        },
      },
    });
await engine.start();
```

这样checkout插件只需要声明下既可。

```yaml
- plugin: '@serverless-cd/checkout'
```





