# pnpm 使用探索

版本：6.24.2

[JavaScript 包管理器简史](https://github.com/zqinmiao/js-coding-rover/docs/yarn/javascript-package-manager-history/index.md)

[幻影依赖（Phantom dependencies）](./docs/phantom-dependencies.md)

## 安装初尝试

当我在一个没有`package.json`的项目下执行`pnpm install lodash`，CLI 提示安装的包在系统中的位置及目录

```bash
$ pnpm install lodash

Packages: +1
+
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /Users/mark/.pnpm-store/v3
  Virtual store is at:             node_modules/.pnpm

dependencies:
+ lodash 4.17.21
```

添加了`package.json`后再执行`pnpm add lodash`

```bash
$ pnpm add lodash

Packages: +1
+
Packages are hard linked from the content-addressable store to the virtual store.
  Content-addressable store is at: /Users/mark/.pnpm-store/v3
  Virtual store is at:             node_modules/.pnpm

dependencies:
+ lodash 4.17.21

Progress: resolved 1, reused 1, downloaded 0, added 1, done

```

安装一个需要`peerDependencies`的包时，会提示安装 peer dependencies，`node_modules`中依然会安装成功要安装的包

```bash
$ pnpm add webpack-cli -D

Packages: +50
++++++++++++++++++++++++++++++++++++++++++++++++++
Progress: resolved 51, reused 43, downloaded 8, added 50, done

devDependencies:
+ webpack-cli 4.9.1

 WARN  Issues with peer dependencies found
.
└─┬ webpack-cli
  ├── ✕ missing peer webpack@"4.x.x || 5.x.x"
  └─┬ @webpack-cli/configtest
    └── ✕ missing peer webpack@"4.x.x || 5.x.x"
Peer dependencies that should be installed:
  webpack@">=4.0.0 <5.0.0 || >=5.0.0 <6.0.0"
```

然后我此时安装 webpack

```bash
$ pnpm add webpack -D

Packages: +72 -2
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++--
Progress: resolved 121, reused 116, downloaded 5, added 72, done

devDependencies:
+ webpack 5.65.0
- webpack-cli 4.9.1
+ webpack-cli 4.9.1
```

## `node_modules/.bin`中的文件总是 shell 文件

[PNPM 的局限](https://pnpm.io/zh/limitations)中的第三点中说到

## [workspace](https://pnpm.io/zh/workspaces)

需要在项目根目录添加文件[`pnpm-workspace.yaml`](https://pnpm.io/zh/pnpm-workspace_yaml)，内容如下：

```yaml
packages:
  # 所有在 packages/ 和 components/ 子目录下的 package
  - "packages/**"
  - "components/**"
  # 不包括在 test 文件夹下的 package
  - "!**/test/**"
```
