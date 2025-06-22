# SimpleStorage Ether.js

## 软件安全、环境准备

之前我们一直在使用 Remix IDE，集成开发环境（IDE），在这里我可以尝试代码、尝试 solidity，可以编译，可以部署，几乎可以做我们需要做的一切事情。它以 web 为基础，可以做测试，调试 bug，部署本地 JavaScriptVM。

这是一个非常快速且容易地创建和测试我们智能合约的方式，但是它也有一些局限性，它只能处理智能合约，不能真正地与项目其他部分集成。它对测试和定制部署的支持有限，并且还需要你保持联网才能使用 Remix。要想实现更高级的功能会比较麻烦。

现在我们要转而使用一种更为专业的智能合约开发者配置 - Hardhat，也就是所谓的智能合约开发框架。它和 Brownie 或 Foundry 类似，有很多这样的框架。之所以我们使用 Hardhat，是因为它是基于 JavaScript 的。这是一个基于 JavaScript 的开发环境。

Hardhat 有基于 JavaScript 的编译环境，部署、测试、Bug 调试。

ethers.js 是一个基于 JavaScript 的库，用来编写智能合约，也是我们使用下一个工具的基础，即 Hardhat。Hardhat 的底层使用了很多 ethers.js 的东西，所以对我们来说，学习 ethers.js 非常重要。

工具安装：Visual Studio Code、nodejs、Git。

> 工具安装过程就不赘述了，搜索 Chrome 或按照官方文档进行安装即可。


## 编译 Solidity 代码

为了编译我们的 SimpleStorage 合约，我们需要使用一个名为 “[solcjs](https://github.com/ethereum/solc-js)” 的工具。

```bash
npm init -y

npm install solc
```
