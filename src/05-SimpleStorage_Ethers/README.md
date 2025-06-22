# SimpleStorage Ethers.js

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
# 初始化 npm 项目
npm init -y

# 安装 solc
npm install solc

# 查看 solc 所有命令
npx solcjs --help
```

编译 contracts 目录下的合约文件，并输出到 dist 目录

```bash
npx solcjs --bin --abi --include-path node_modules/ --base-path . -o dist contracts/SimpleStorage.sol
```

配置 package scripts 脚本

```json
{
  "name": "05-simplestorage_ethers",
  "version": "1.0.0",
  "main": "deploy.js",
  "scripts": {
    "compile": "npx solcjs --bin --abi --include-path node_modules/ --base-path . -o dist contracts/SimpleStorage.sol"
  },
  "keywords": [],
  "author": "",
  "license": "  ",
  "dependencies": {
    "solc": "^0.8.30"
  }
}
```


现在你直接运行以下命令就可以运行整个脚本执行编译。

```bash
npm run compile
```

## Ganache 以及网格介绍

我们需要部署编译后的文件到 JavaScript 虚拟机环境。后面，我们会使用 Hardhat 运行时环境，作为我们的 JavaScript 虚拟机。

现在我们可以使用 “[Ganache](https://archive.trufflesuite.com/ganache/)” 的工具。

> Truffle Suite 即将停用。点击此处查看后续支持和迁移选项。感谢您长期以来的支持。
> 2025.06.22 目前还可用。

Ganache 和 Remix 里的虚拟机很相似，这是一个我们可以在本地运行的假区块链，可以供我们进行测试，部署还有代码。这也是观察区块链正在发生事情的好办法。

你只需要安装 Ganache，它就会在你的计算机本地启动一个假区块链。它带有一大堆假帐户，就和 Remix 上每个带有 100 ETH 的假帐户完全一样，Ganache 同样也带有一大堆假帐户并且每个账户也都有 100 ETH。

它们还附有私钥，这可以让我们在应用程序中控制这些假帐户。记住，不要在公共区块链上使用这些私钥，它们仅用于开发目的。因为很多人都知道这些私钥。

在我们的代码中，我们首先要做的就是连接到我们的区块链上，Remix 在幕后完成了这项工作。

如果我们选择 JavaScript 虚拟机（Remix VM），Remix 就会选择它自己的运行的假区块链。如果我们选择 WalletConnect，就可以选择 MetaMask，Remix 就会连接到我们的 MetaMask 上。

Remix 所作的这种连接，其实是一件很有意思的事情。它通过与区块链连接连接到我们的 MetaMask。
如果你打开 MetaMask，打开网络选项卡，就可以看到这些不同网络的一系列信息。我们可以看到一个叫做 “RPC URL” 的东西，RPC 代表 “远程过程调用” （Remote Procedure call），URL 则是 “统一资源定位符”（Uniform Resource Locator）。“RPC URL” 代表正在运行的区块链节点的连接。这个 URL 的连接可以让我们用 API 进行调用，并且和区块链节点进行交互。

区块链节点使用特定软件运行，其中的一些会公开 API 调用，如果你去查看 “[Go Ethereum](https://github.com/ethereum/go-ethereum)” 仓库，上面也有教程告诉你如何运行一个自己的区块链节点。并且是在一个像以太坊这样的真实的区块链上。其中的大多数都会带有 “--http.addr” 字段以公开其 RPC 端点。

如果你想运行属于你自己的节点，一个真实区块链的节点，而不是 MetaMask 或者其他供应商提供的节点，就可以使用 “Go Ethereum”。

正是 RPC URL 让我们能够连接到 Sepolia，如果使用的是 Sepolia 测试网络。同理，这也是我们连接到 Ganache 区块链的方式。Ganache 客户端主页展示的 RPC Server 就是当前 Ganache 节点的端点。

```javascript
async function main() {
  // RPC URL: http://127.0.0.1:7545
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

当我们有 RPC Server Url，就可以开始对这个节点进行 API 调用了。我们可以对节点发起不同的调用，以获得不同的信息。我们可以使用 “axios” 或 “fetch” 请求 API 跟节点进行交互。

## Ethers.js

[Ethers.js](https://docs.ethers.org/v6/getting-started/) 是最流行的 JavaScript 工具包之一，它能让我们与不同的区块链进行交互，并且有许多封装函数可以进行 API 调用。它可以在以太坊、Polygon、Avalanche 等一切兼容 EVM 的区块链上使用。

还有一个同样受欢迎的包，[web3.js](https://web3js.readthedocs.io/en/v1.10.0/getting-started.html)，它也可以做到前面所说的那些事，你可能之前就听说过这个东西。

我们使用 Ethers 的原因是，ethers 是支撑 Hardhat 环境的主要工具。

```bash
npm install ethers
```

> 记得修改 package.json 文件，增加 type: "module" 配置，它代表我们将使用 ES Module 语法。

```javascript
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0x1dc4eddbae3e94a12cb39a5452af108493c08f19dff61734cf6be692be6bc3c4"
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

注意，直接把私钥粘贴进代码是一个大忌，后面我们会避免这样使用。现在没关系，应该我们使用的是本地的 Ganache 上的私钥。所以并不存在与此账户关联的资金风险。

上面这两行代码，就足以提供我们与智能合约交互所需要的一切。它们提供了我们与区块链的连接，并提供一个带有私钥的钱包，我们可以对不同的交易进行签名。

```javascript
import { ethers } from "ethers";
import fs from "fs";

async function main() {
  // 1. 连接到区块链
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0x1dc4eddbae3e94a12cb39a5452af108493c08f19dff61734cf6be692be6bc3c4"
  );

  // 2. 读取 ABI 和二进制文件
  const abi = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  // 3. 创建合约工厂
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("部署合约中...");

  // 4. 部署合约
  const contract = await contractFactory.deploy();

  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

ethers 合约工厂只是一个用来部署合约的对象。

注意，需要修改 solc 的版本，使用 0.8.7-fixed 版本，同时修改合约定义的版本。目前的版本太高，部署会有问题。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

contract SimpleStorage {
  uint256 favoriteNumber;

  struct People {
    uint256 favoriteNumber;
    string name;
  }

  People[] public people;

  mapping(string => uint256) public nameToFavoriteNumber;

  function store(uint256 _favoriteNumber) public virtual {
    favoriteNumber = _favoriteNumber;
  }

  function retrieve() public view returns (uint256) {
    return favoriteNumber;
  }

  function addPerson(string memory _name, uint256 _favoriteNumber) public {
    people.push(People(_favoriteNumber, _name));
    nameToFavoriteNumber[_name] = _favoriteNumber;
  }
}
```

```json
{
  "name": "05-simplestorage_ethers",
  "version": "1.0.0",
  "main": "deploy.js",
  "type": "module",
  "scripts": {
    "compile": "npx solcjs --bin --abi --include-path node_modules/ --base-path . -o dist contracts/SimpleStorage.sol"
  },
  "keywords": [],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "ethers": "^6.14.3",
    "solc": "^0.8.7-fixed"
  }
}
```

