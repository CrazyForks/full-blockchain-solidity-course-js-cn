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

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

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

运行命令编译合约确保可以编译成功。

```bash
npx hardhat compile
```

然后 ignition/modules 目录下，创建我们的部署脚本，`SimpleStorage.js`。

```javascript
// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleStorageModule", m => {
  const simpleStorage = m.contract("SimpleStorage");
  return { simpleStorage };
});
```

部署当前合约

```bash
npx hardhat ignition deploy ignition/modules/SimpleStorage.js --network localhost
```

> 部署时，可以不指定 --network，localhost 是我们使用 npx hardhat node 命令运行的一个本地测试网络

这样我们就可以成功部署合约了。

```
network localhost
Hardhat Ignition 🚀

Deploying [ SimpleStorageModule ]

Batch #1
  Executed SimpleStorageModule#SimpleStorage

[ SimpleStorageModule ] successfully deployed 🚀

Deployed Addresses

SimpleStorageModule#SimpleStorage - 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

接下来然我们尝试另一种办法，直接编写自定义部署脚本（scripts/deploy.js）:

```javascript
const { ethers } = require("hardhat");

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");
  const simpleStorage = await simpleStorageFactory.deploy();

  console.log("Waiting for deployment...");
  await simpleStorage.waitForDeployment();

  console.log("SimpleStorage deployed to:", simpleStorage.target);

  console.log("SimpleStorage address:", await simpleStorage.getAddress());
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
```

然后直接执行脚本

```bash
npx hardhat run .\scripts\deploy.js
```

运行结果如下，也可以成功部署：

```
Deploying contract...
Waiting for deployment...
SimpleStorage deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
SimpleStorage address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

## Hardhat 网络

Hardhat 内置了一个很棒的工具叫做 “Hardhat Network”，它是一个专为开发而设计的本地以太坊网络节点。与 Ganache 相似，它允许你部署合约，运行测试以及调试代码。

当我们在 Hardhat 中运行命令、脚本或者任务时，都是默认部署到这个虚拟的 Hardhat Network。
它会自动为你提供一个虚拟区块链以及虚拟密钥，所以你可以不显式声明密钥。

```javascript
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
};
```

Hardhat 提供了一个默认网络，我们也可以自己配置 networks，像下面这样。

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  }
};

```

每一条 EVM 基础网络都有一个新的 chainId。通过上面的配置，我们可以轻易地将合约部署到测试网络。

```bash
npx hardhat ignition deploy ignition/modules/SimpleStorage.js --network sepolia
```

或

```bash
npx hardhat run .\scripts\deploy.js --network sepolia
```

## 代码方式验证合约

