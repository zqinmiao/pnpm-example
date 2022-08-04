# 关于幻影依赖（[Phantom dependencies](https://rushjs.io/pages/advanced/phantom_deps/)）的问题

按照官方文档，且在[`.npmrc`](https://pnpm.io/zh/npmrc)中配置了`hoist=false`。

## 使用`lodash`和`eslint`的子包，未能解决幻影依赖的问题

⚠️pnpm@7.1.6，可以解决 ✅

### 在`package-a`中安装了`lodash`和`eslint`

```json
{
  "dependencies": {
    "lodash": "^4.17.21",
    "node-emoji": "^1.11.0"
  },
  "devDependencies": {
    "eslint": "^8.x"
  }
}
```

### 在`package-b`中并没有安装`lodash`和`eslint`

```json
{
  "dependencies": {},
  "devDependencies": {}
}
```

### `package-b/index.js`中代码如下

```js
const { isArray } = require("lodash");

const eslint = require("eslint");

console.log("isArray", isArray(""), isArray([]));

console.log("eslint", eslint);
```

### 执行`node packages/package-b/index.js`，输出

```bash
isArray false true
eslint {
  Linter: [class Linter],
  ESLint: [class ESLint],
  RuleTester: [class RuleTester] {
    [Symbol(itOnly)]: null,
    [Symbol(it)]: null,
    [Symbol(describe)]: null
  },
  SourceCode: [class SourceCode extends TokenStore]
}
```

## 对于`node-emoji`，解决了幻影依赖的问题

- 在`package-a`中安装`node-emoji`
- 在`package-b`中没有安装`node-emoji`

### `package-b/index2.js`中代码如下

```js
var emoji = require("node-emoji");

console.log("coffee", emoji.get("coffee"));
```

### 执行`node packages/package-b/index2.js`，输出

报错`Cannot find module 'node-emoji'`

```bash
internal/modules/cjs/loader.js:883
  throw err;
  ^

Error: Cannot find module 'node-emoji'
Require stack:
- pnpm-example/packages/package-b/index2.js
```

## monorepo 工程，子包可以访问到根目录安装的依赖

根目录下的`package.json`

```json
{
  "dependencies": {
    "node-emoji": "^1.11.0"
  },
  "devDependencies": {}
}
```

`package-b`中依旧没有安装`node-emoji`，然后执行`node packages/package-b/index2.js`，成功输出

```bash
coffee ☕
```

## 总结

关于[pnpm 的 node_modules 配置选项](https://pnpm.io/zh/blog/2020/10/17/node-modules-configuration-options-with-pnpm)，有详细讲解

由实践我们可以得知:

- 对于`有些包`来说，即使`hoist=false`也依然会存在幻影依赖的问题。
- monorepo 工程下，子包未声明的依赖，依然可以用到`根目录下的依赖`，这是`node 解析`决定的，无法避免。
- `pnp` 模式更加严格，可以完全杜绝幻影依赖，无论是`兄弟包`还是对于`根依赖`
