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

[@nomicfoundation/hardhat-toolbox](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-toolbox)：捆绑了我们推荐使用 Hardhat 进行开发的所有常用软件包和 Hardhat 插件。

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
npx hardhat run ./scripts/deploy.js --network sepolia
```

## 代码方式验证合约

我们现在已经使用 hardhat 把合约部署到 Sepolia 上了，不过我们还没有验证合约。

不过我们不必再从浏览器去验证合约了，只需要在部署脚本添加一些代码，就可以完成自动验证操作。

我们实现的这个验证过程，适用于像 etherscan 这样的区块链浏览器。但可能无法在 [ethplorer](https://ethplorer.io) 或其他区块链浏览器上工作。

如果你想要在其他区块浏览器上进行验证，它们会有相应的 API 供你使用。

像 [etherscan](https://docs.etherscan.io) 和其他大多数区块链浏览器在它们的网站都有一个名为 API 文档的部分，它们会提供以编程与 etherscan 进行交互和操作的方式。

我们可以使用 api 直接交互，或使用 hardhat 自带的扩展插件，它会使验证过程变得非常简单。

这里我们使用 [hardhat-verify](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify) 来实现合约验证。

```bash
# 安装 hardhat-verify
npm install --save-dev @nomicfoundation/hardhat-verify
```

hardhat.config.js 中引入插件

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
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
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

我们还需要在 [etherscan](https://etherscan.io) 申请一个 API KEY。配置好 API KEY 后，我们只需要运行下面的命令，就可以完成合约验证。

```bash
npx hardhat verify --network sepolia [your address]
```

不过我们会让这个过程更加程序化，所以我们继续编写自定义脚本逻辑：

```javascript
const { ethers, run } = require("hardhat");

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");
  const simpleStorage = await simpleStorageFactory.deploy();

  console.log("Waiting for deployment...");
  await simpleStorage.waitForDeployment();

  console.log("SimpleStorage deployed to:", simpleStorage.target);
  console.log("SimpleStorage address:", await simpleStorage.getAddress());

  if (network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 6 blocks...");
    await simpleStorage.deploymentTransaction().wait(6);
    await verify(simpleStorage.target, []);
  }
}
async function verify(contractAddress, args) {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    });

    console.log("Contract verified!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified!");
    } else if (error.message.toLowerCase().includes("timeout")) {
      console.log("Verification timeout, please try again later...");
    } else {
      console.log("Error verifying contract:", error.message);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
```

我们使用 chainId 来区分不同网络，当我们使用本地网络时，不需要验证合约，就算验证也没有意义。

好，现在我们直接使用脚本进行验证：

```bash
npx hardhat run ./scripts/deploy.js --network sepolia
```

如果你遇到 artifacts 验证有问题，可以删除掉重新运行脚本，hardhat 每次运行都会重新编译合约代码。
如果你遇到网络超时问题，可以设置 tun 模式全局代理，或者使用终端代理，指向你的代理地址。

```bash
export https_proxy=http://127.0.0.1:7890
export http_proxy=http://127.0.0.1:7890
```

```javascript
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

## 通过 Hardhat 与合约交互

```javascript
const currentValue = await simpleStorage.retrieve();
console.log("Current value is:", currentValue.toString());

const transactionResponse = await simpleStorage.store(7);
await transactionResponse.wait(1);

const updatedValue = await simpleStorage.retrieve();
console.log("Updated value is:", updatedValue.toString());
```

## 自定义 Hardhat 任务

创建 tasks 目录，编写 `block-number.js` 文件，我们将使用它来获取当前的区块编号。

```javascript
const { task } = require("hardhat/config");

task("block-number", "Prints the current block number").setAction(
  async (taskArgs, hre) => {
    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("Current block number:", blockNumber);
  }
);
```

然后在配置文件中引用它。

```javascript
require("dotenv").config();

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("./tasks/block-number");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

```

现在运行 `npx hardhat` 就可以看到我们的自定义任务。

我们可以使用 `npx hardhat block-number` 执行我们的自定义任务。

```
Current block number: 0
```

可以看到，我们可以获得区块编号为 0。这是正确的，因为我们使用的是默认网络。它每次运行后都会重置。

如果我们运行 `npx hardhat block-number --network sepolia`，就会得到不一样的结果。

```
Current block number: 8626231
```

现在我们已经编写过脚本和任务，它们都可以与合约交互，并且部署智能合约。

任务更适合于插件，脚本更适合用于你自己的本地开发环境。

## Hardhat 本地节点

正如你所看到的，之前我们每次使用默认网络运行脚本，运行完后，那个网络就会被删除。这样我们就没办法跟合约做进一步的交互。其实有一种办法可以让我们运行一个类似使用用户界面运行的本地网络。

```bash
npx hardhat node
```

这样就可以在本地网络启动一个节点，它与 Ganache 完全相同，只不过运行在我们的终端中。

这个在本地运行的网络可以指定 `--network localhost` 来使用。

## Hardhat 控制台

我们可以使用 `npx hardhat console --network localhost` 进行 shell 控制台。

在这个 shell 控制台中，我们可以做在 deploy 脚本中做的任何事情。我们不需要任何导入动作，因为 Hardhat 里的所有包都已经在控制台被自动导入了。

这个控制台适用于所有网络，不仅仅是测试网络。

## 缓存清除

```bash
# 清除 artifacts 缓存
npx hardhat clean
```

## 运行测试

hardhat 最大的优点之一就是非常适合运行测试。测试环节对于你的智能合约开发至关重要，我们可能会花费大量的时间来编写良好的测试。

Hardhat 测试使用的是 Mocha 框架，它是一个基于 JavaScript 的框架用于运行我们的测试。

```javascript
const {
  loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("SimpleStorage", function () {
  async function deploySimpleStorageFixture() {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();
    return { simpleStorage };
  }

  describe("Deployment", function () {
    it("Should set the right favoriteNumber", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
      expect(await simpleStorage.retrieve()).to.equal(0);
    });

    it("Should set the right favoriteNumber after store", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

      const tx = await simpleStorage.store(123);
      await tx.wait(1);

      expect(await simpleStorage.retrieve()).to.equal(123);
    });
  });

  describe("People", function () {
    describe("Add Person", function () {
      it("Should add a person to the people array", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

        await simpleStorage.addPerson("John", 123);

        const person = await simpleStorage.people(0);
        expect(person.favoriteNumber).to.equal(123);
      });

      it("Should add a person to the people array", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

        await simpleStorage.addPerson("John", 123);
        await simpleStorage.addPerson("Jane", 456);

        const person = await simpleStorage.people(1);
        expect(person.favoriteNumber).to.equal(456);
      });
    });

    describe("NameToFavoriteNumber", function () {
      it("Should add a person to the nameToFavoriteNumber mapping", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

        await simpleStorage.addPerson("John", 123);

        expect(await simpleStorage.nameToFavoriteNumber("John")).to.equal(123);
      });
    });
  });
});
```

运行测试脚本

```bash
npx hardhat test
```

如果我们有很多测试，可以模糊搜索关键字进行测试：

```bash
npx hardhat test --grep store
```

## Hardhat Gas Reporter

Hardhat 最受欢迎的扩展之一，“hardhat-gas-reporter”。这个是可以附加到我们所有测试上的扩展，并自动提供类似这样的输出。以告诉我们每个函数大约消耗了多少 Gas。

> 下面是 gas reporter 的安装以及使用方式，不过 @nomicfoundation/hardhat-toolbox 中其实已经内置 gas-reporter 插件和 hardhat-verify 插件。

安装

```bash
npm install --save-dev hardhat-gas-reporter
```

```javascript
require("dotenv").config();

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");

require("./tasks/block-number");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true
  }
};
```

查看 Gas 报告，可以帮助我们最大程度地优化 gas 分配。

```javascript
gasReporter: {
  enabled: true,
  outputFile: "gas-report.txt"
}
```

我们可以使用 outputFile 将报告输出到一个文件。

我们还可以配置 currency，可以获得类似以太坊这样的区块链上每个函数的 USD 成本。为此需要一个 [CoinMarketCap](https://pro.coinmarketcap.com/account) 的 API 密钥。

```javascript
gasReporter: {
  enabled: true,
  outputFile: "gas-report.txt",
  currency: "USD",
  coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  etherscan: process.env.ETHERSCAN_API_KEY
}
```

这样，我们的 gas 报告中就包含美元价格了。注意，这里我们也需要配置 etherscan 地址。我们还可以配置其他 token。

```
·············································································································
|  Solidity and Network Configuration                                                                       │
························|·················|···············|·················|································
|  Solidity: 0.8.28     ·  Optim: false   ·  Runs: 200    ·  viaIR: false   ·     Block: 30,000,000 gas     │
························|·················|···············|·················|································
|  Network: ETHEREUM    ·  L1: 3 gwei                     ·                 ·        2433.54 usd/eth        │
························|·················|···············|·················|················|···············
|  Contracts / Methods  ·  Min            ·  Max          ·  Avg            ·  # calls       ·  usd (avg)   │
························|·················|···············|·················|················|···············
|  SimpleStorage        ·                                                                                   │
························|·················|···············|·················|················|···············
|      addPerson        ·         95,446  ·      112,534  ·        108,262  ·             4  ·        0.79  │
························|·················|···············|·················|················|···············
|      store            ·              -  ·            -  ·         43,724  ·             2  ·        0.32  │
························|·················|···············|·················|················|···············
|  Deployments                            ·                                 ·  % of limit    ·              │
························|·················|···············|·················|················|···············
|  SimpleStorage        ·              -  ·            -  ·        562,687  ·         1.9 %  ·        4.11  │
························|·················|···············|·················|················|···············
|  Key                                                                                                      │
·············································································································
|  ◯  Execution gas for this method does not include intrinsic gas overhead                                 │
·············································································································
|  △  Cost was non-zero but below the precision setting for the currency display (see options)              │
·············································································································
|  Toolchain:  hardhat                                                                                      │
·············································································································
```

我们还可以使用 [solidity-coverage](https://github.com/sc-forks/solidity-coverage) 插件来查看代码的测试覆盖度。如果我们的某些代码没有被测试覆盖，`solidity-coverage` 就会告诉我们。`solidity-coverage` 也是 `@nomicfoundation/hardhat-toolbox` 集成的插件之一，我们并不需要显式安装。

```bash
npx hardhat coverage
```

```
--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts\         |      100 |      100 |      100 |      100 |                |
  SimpleStorage.sol |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
```

运行命令它会给我们输出报告，并且还会生成 `coverage.json` 文件。

## Hardhat Waffle

Hardhat Waffle 是一个用于 “Waffle” 测试框架的一个插件，是一个可以让我们进行高级测试的框架。

是否编写一个好的测试，是判断一个项目专业还是业务的主要区别。测试很重要，尤其是对智能合约开发来说。
