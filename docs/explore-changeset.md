# Changesets 工作流探索

> 在 monorepo 仓库下管理你的版本和更新日志的方法。

[Github](https://github.com/changesets/changesets)

## 官方文档

- [Intro to using changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)（changesets 使用介绍）
- [Detailed explanation](https://github.com/changesets/changesets/blob/main/docs/detailed-explanation.md)（详细解释）
- [Common questions](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)（常见问题）
- [Adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)（添加一个 changeset）
- [Automating changesets](https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md)（自动处理 changesets）
- [Checking for changesets](https://github.com/changesets/changesets/blob/main/docs/checking-for-changesets.md)（检查 changesets）
- [Command line options](https://github.com/changesets/changesets/blob/main/docs/command-line-options.md)（命令行选项）
- [Config file options](https://github.com/changesets/changesets/blob/main/docs/config-file-options.md)（配置文件选项）
- [Decisions](https://github.com/changesets/changesets/blob/main/docs/decisions.md)（决定）
- [Dictionary](https://github.com/changesets/changesets/blob/main/docs/dictionary.md)（词典）
- [Fixed packages](https://github.com/changesets/changesets/blob/main/docs/fixed-packages.md)（固定包）
- [Linked packages](https://github.com/changesets/changesets/blob/main/docs/linked-packages.md)（链接包）
- [Modifying changelog format](https://github.com/changesets/changesets/blob/main/docs/modifying-changelog-format.md)（修改更新日志格式）
- [Prereleases](https://github.com/changesets/changesets/blob/main/docs/prereleases.md)（预发布）
- [Problems publishing in monorepos](https://github.com/changesets/changesets/blob/main/docs/problems-publishing-in-monorepos.md)（在 monorepos 中发布的问题）
- [Snapshot releases](https://github.com/changesets/changesets/blob/main/docs/snapshot-releases.md)（快照发布）
- [Experimental Options](https://github.com/changesets/changesets/blob/main/docs/experimental-options.md)（实验性选项）

## 预备

包管理器：pnpm

工程结构：monorepo

探索所对应的项目：[pnpm-example](https://github.com/zqinmiao/pnpm-example/tree/explore-changeset)

先切到一个新的分支`explore-changeset`，并在 packages 下建两个文件夹`pnpm-example-1（包名：@buibis/pnpm-example-1）`、`@buibis/pnpm-example-2（包名：@buibis/pnpm-example-2）`

提交添加的改动

```bash
git add .
git commit -m "chore: 增加新包"
```

## 开始

我们首先按照 [Intro to using changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)（changesets 使用介绍）中说的，增加`changeset`工具

```bash
npm install @changesets/cli && npx changeset init

# 或者

yarn add @changesets/cli && yarn changeset init

# 或者（这个是pnpm文档：https://pnpm.io/zh/using-changesets，中所列出的）

pnpm add -Dw @changesets/cli && pnpm changeset init
```

选择执行`pnpm add -Dw @changesets/cli && pnpm changeset init`

成功

```bash
devDependencies:
+ @changesets/cli 2.24.4
🦋  Thanks for choosing changesets to help manage your versioning and publishing
🦋
🦋  You should be set up to start using changesets now!
🦋
🦋  info We have added a `.changeset` folder, and a couple of files to help you out:
🦋  info - .changeset/README.md contains information about using changesets
🦋  info - .changeset/config.json is our default config
```

查看版本

```bash
pnpm changeset --version
2.24.4
```

默认配置`.changeset/config.json`

```json
{
  "$schema": "https://unpkg.com/@changesets/config@2.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "restricted",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

## 添加 changesets（Adding changesets）

执行`pnpm changeset`，报错：

```bash
🦋  error Error: Failed to find where HEAD diverged from main. Does main exist?
```

然后将配置中的`baseBranch`值改为`master`后再执行`pnpm changeset`，工作流如下：

![](./Sep-14-2022%2011-18-20.gif)

此时`.changeset`目录下生成了`chilled-baboons-own.md`，内容如下：

```md
---
"@buibis/pnpm-example-1": major
"@buibis/pnpm-example-2": major
---

增加包@buibis/pnpm-example-1, @buibis/pnpm-example-2
```

## 生成版本和发布（Versioning and publishing）

执行`pnpm changeset version`

```bash
pnpm changeset version
🦋  All files have been updated. Review them and commit at your leisure
```

💥 然后之前生成的`chilled-baboons-own.md`消失了。伴随的是在包`@buibis/pnpm-example-1`和`@buibis/pnpm-example-2`的文件夹下分别生成了`CHANGELOG.md`。也就是说`chilled-baboons-own.md`被他们消费了

@buibis/pnpm-example-1

```md
# @buibis/pnpm-example-1

## 2.0.0

### Major Changes

- 增加包@buibis/pnpm-example-1, @buibis/pnpm-example-2
```

@buibis/pnpm-example-1

```md
# @buibis/pnpm-example-2

## 2.0.0

### Major Changes

- 增加包@buibis/pnpm-example-1, @buibis/pnpm-example-2

### Patch Changes

- Updated dependencies
  - @buibis/pnpm-example-1@2.0.0
```

---

<mark style="background: #FF5582A6;">到这里我们先暂停一下，因为我们发现默认情况下生成的版本是「major」的大版本。那如果我想要生成「 'minor' | 'patch'」应该如何操作？</mark>

### 生成 minor | patch

#### 方式一

将`.changeset`目录下生成的`chilled-baboons-own.md`文件中的「major」改为`minor|patch`，如：

```md
---
"@buibis/pnpm-example-1": minor
"@buibis/pnpm-example-2": patch
---
```

---

<mark style="background: #FF5582A6;">现在我们生成的 Changelog 的内容是需要手动进行编辑维护的，那么我想要生成的内容根据 git commit 的信息来呢？</mark>

试了[Modifying changelog format](https://github.com/changesets/changesets/blob/main/docs/modifying-changelog-format.md)（修改更新日志格式）文档中所介绍的两个包`@changesets/changelog-git` 和 `@changesets/changelog-github` 都没效果。

看了 changesets 官方的 github 仓库，然后 clone 下来试了下，也不行，不能生成像下面的 changelog 内容格式

![](./Pasted%20image%2020220914153917.png)

然后我在同样使用了 changeset 的 emotion 仓库中尝试，结果报错，看样子是要结合 GITHUB_TOKEN 才可以（<mark style="background: #FFB8EBA6;">但是我自己的项目却没有报错信息，成功了，但是就是没有 commit 信息</mark> ）

```bash
yarn changeset version

The following error was encountered while generating changelog entries
We have escaped applying the changesets, and no files should have been affected
🦋  error Error: Please create a GitHub personal access token at https://github.com/settings/tokens/new and add it as the GITHUB_TOKEN environment variable
```

使用`GITHUB_TOKEN=you_token yarn changeset version` 就不会报错了

## 暂时的总结

暂时总结一下吧

- 对于 monorepo 仓库，生成版本号，需要手动进行维护才能决定是`major|minor|patch`。不能像 lerna 一样，根据 commit 的类型来自动判断是`「major|minor|patch」`
- changelog 的格式，如果想要自定义的话，需要自己手动去写工具函数。生态中没有像`conventional-changelog-cli`那样可便捷配置的工具
- `@changesets/changelog-git` 和 `@changesets/changelog-github`这两个包没有友好的文档，使用起来一脸懵逼
- 预发布版本的流程较为繁琐
- 对于 CI/CD 的支持同样是一脸懵逼
