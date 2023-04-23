# 探索 npm registry 及测试 npm 包

关于 pnpm 的探索，移步`master`分支

`>=pnpm@7.9.0`

探索了对于包`rollup_v3__lib-intellisense`的使用情况：

- 使用`rollup`和`webpack`来打包 lib(库)时，使用`rollup_v3__lib-intellisense`，查看是否有`Tree Shaking`。以下示例中`echoHaha`导入了但并未使用，对中打包出的产物，`rollup`和`webpack`都未将其源码打包进去

  ```js
  import { checkIsArray, echoHaha } from "rollup_v3__lib-intellisense";

  console.log("isArray", checkIsArray(""), checkIsArray([]));

  export * from "./a";

  export * from "./b";
  ```

还有其他一些问题，详情在知识库中搜索`使用rollup v3创建一个包的示例`
