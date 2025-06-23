# Hardhat

[Hardhat](https://hardhat.org/) 是最容易上手的一个。它很有可能是目前智能合约开发中最受欢迎的框架之一。

Hardhat 是一种开发环境，它允许基于 JavaScript 的开发。有点像我们看到的 ethers.js。它为我们提供了更多的工具，使我们的代码与我们想做的事情相结合。

它具有难以置信的可扩展性，并且还有非常好的调试功能。它还是一个很棒的工具。

## Hardhat 安装

```bash
npm init --yes

npm install --save-dev hardhat

npx hardhat init
```

> hardhat: ^2.25.0
> solidity: 0.8.28

## 帮助文档

```bash
npx hardhat
```

可用任务清单：

check                 检查
clean                 清理缓存并删除所有构建文件
compile               编译整个项目，构建所有文件
console               打开 Hardhat 控制台
coverage              生成测试代码覆盖率报告
flatten               扁平化并打印合约及其依赖项。如果未指定文件，将扁平化项目中的所有合约。
gas-reporter:merge
help                  打印此帮助信息
hhgas:merge
node                  在 Hardhat Network 上启动 JSON-RPC 服务器
run                   编译项目后运行用户定义的脚本
test                  运行 Mocha 测试
typechain             为编译的合约生成 Typechain 类型定义
verify                在 Etherscan 或 Sourcify 上验证合约

你可以运行 `npx hardhat node` 运行 JSON-RPC 服务器，查看测试账户列表。使用 `ctrl + c` 退出服务器。

运行 `npx hardhat compile` 会生成 cache 和 artifacts 目录。
cache 包含一个快速访问 solidity 文件的 json。artifacts 文件夹包含所有关于我们编译的代码信息。

## 通过 Hardhat 部署 Simple Storage

