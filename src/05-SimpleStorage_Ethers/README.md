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

现在我们已经部署好了合约，我们也可能会想要等待一个区块以确保它确实已经上链。

```solidity
import { ethers } from "ethers";
import fs from "fs";

async function main() {
  // 1. 连接到区块链
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0x63754b678510506051d95b5ed5338e4f03b651fb22dcfd26c1a39b68a0fd68c1",
    provider
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

  // 5. 等待部署完成
  await contract.waitForDeployment();

  // 6. 获取合约地址
  const contractAddress = await contract.getAddress();
  console.log("合约部署成功！地址:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

## 通过 ethers.js 发送 `_raw_` 交易

```javascript
import { ethers } from "ethers";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0x63754b678510506051d95b5ed5338e4f03b651fb22dcfd26c1a39b68a0fd68c1",
    provider
  );

  const nonce = await wallet.getNonce();
  console.log("nonce", nonce);

  const tx = {
    nonce: nonce,
    gasPrice: 20000000000,
    gasLimit: 1000000,
    to: null,
    value: 0,
    data: "0x608060405234801561001057600080fd5b50610771806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632e64cec11461005c5780636057361d1461007a5780636f760f41146100965780638bab8dd5146100b25780639e7a13ad146100e2575b600080fd5b610064610113565b604051610071919061052a565b60405180910390f35b610094600480360381019061008f919061046d565b61011c565b005b6100b060048036038101906100ab9190610411565b610126565b005b6100cc60048036038101906100c791906103c8565b6101b6565b6040516100d9919061052a565b60405180910390f35b6100fc60048036038101906100f7919061046d565b6101e4565b60405161010a929190610545565b60405180910390f35b60008054905090565b8060008190555050565b6001604051806040016040528083815260200184815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101908051906020019061018c9291906102a0565b505050806002836040516101a09190610513565b9081526020016040518091039020819055505050565b6002818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600181815481106101f457600080fd5b906000526020600020906002020160009150905080600001549080600101805461021d9061063e565b80601f01602080910402602001604051908101604052809291908181526020018280546102499061063e565b80156102965780601f1061026b57610100808354040283529160200191610296565b820191906000526020600020905b81548152906001019060200180831161027957829003601f168201915b5050505050905082565b8280546102ac9061063e565b90600052602060002090601f0160209004810192826102ce5760008555610315565b82601f106102e757805160ff1916838001178555610315565b82800160010185558215610315579182015b828111156103145782518255916020019190600101906102f9565b5b5090506103229190610326565b5090565b5b8082111561033f576000816000905550600101610327565b5090565b60006103566103518461059a565b610575565b90508281526020810184848401111561037257610371610704565b5b61037d8482856105fc565b509392505050565b600082601f83011261039a576103996106ff565b5b81356103aa848260208601610343565b91505092915050565b6000813590506103c281610724565b92915050565b6000602082840312156103de576103dd61070e565b5b600082013567ffffffffffffffff8111156103fc576103fb610709565b5b61040884828501610385565b91505092915050565b600080604083850312156104285761042761070e565b5b600083013567ffffffffffffffff81111561044657610445610709565b5b61045285828601610385565b9250506020610463858286016103b3565b9150509250929050565b6000602082840312156104835761048261070e565b5b6000610491848285016103b3565b91505092915050565b60006104a5826105cb565b6104af81856105d6565b93506104bf81856020860161060b565b6104c881610713565b840191505092915050565b60006104de826105cb565b6104e881856105e7565b93506104f881856020860161060b565b80840191505092915050565b61050d816105f2565b82525050565b600061051f82846104d3565b915081905092915050565b600060208201905061053f6000830184610504565b92915050565b600060408201905061055a6000830185610504565b818103602083015261056c818461049a565b90509392505050565b600061057f610590565b905061058b8282610670565b919050565b6000604051905090565b600067ffffffffffffffff8211156105b5576105b46106d0565b5b6105be82610713565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b82818337600083830152505050565b60005b8381101561062957808201518184015260208101905061060e565b83811115610638576000848401525b50505050565b6000600282049050600182168061065657607f821691505b6020821081141561066a576106696106a1565b5b50919050565b61067982610713565b810181811067ffffffffffffffff82111715610698576106976106d0565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61072d816105f2565b811461073857600080fd5b5056fea2646970667358221220c87aec3b3d919251ff63d37c506587576a7ef53e239b1962a02d5633ac7cd40764736f6c63430008070033",
    // chainId: 1377
  };
}
```

> chainId 在 ethers 中，也可以不传递，使用默认值。

Nonce 是一个使用频率很高的单词。在 区块链中，我们使用 nonce 来尝试解决挖矿难题，nonce 在交易中也被用于钱包来给交易签名，他们在每笔交易中都使用不同的 nonce。所以，当我们讨论钱包时，讨论的是一个独立交易相关的数字。当讨论区块链时，nonce 是用来解决挖矿 “难题” 的。

当你发送一个交易时，你有这个数据对象，你就可以填入这些东西，我们现在正在用二进制代码填充我们的数据对象。
这些二进制数据会告诉区块链如何部署这个智能合约。

每一条 EVM 链都有不同的 Chain ID，可能有人会遇到 Chain ID 和 Network ID 不一致的情况。

上面这段交易细节还需要签名，然后才能将其发送到我们的区块链上。

```javascript
const signedTxResponse = await wallet.signTransaction(tx);
console.log(signedTxResponse);
```

我们运行 signedTransaction 得到 signedTxResponse，会传播到另一个区块吗？我们可以得到以响应，但如果回到 ganache 刷新，我们实际上没有看到发送的另一笔交易。我们这里我们只是对交易进行签名，我们实际并没有发送它。但不是已发送的交易，这是不同的。

```javascript
const sendTxResponse = await wallet.sendTransaction(tx);
await sendTxResponse.wait(1); // 等待交易被确认

console.log(sendTxResponse);
```

我们可以使用 `sendTransaction` 发送交易，然后等待一个区块确认，以确保这笔交易真正通过。

> sendTransaction，内部函数实现，会调用 signTransaction 函数，所以我们不用对 tx 进行签名。

sendTxResponse 响应值如下：

```
TransactionResponse {
  provider: JsonRpcProvider {},
  blockNumber: null,
  blockHash: null,
  index: undefined,
  hash: '0x43beae6eae04c735aeb09ab155b81583a844191d4761532f573bf45cb4eabbae',
  type: 2,
  to: null,
  from: '0x379E7277501283Aa1c7eB83A013D3Ff81Af3e667',
  nonce: 3,
  gasLimit: 1000000n,
  gasPrice: undefined,
  maxPriorityFeePerGas: 20000000000n,
  maxFeePerGas: 20000000000n,
  maxFeePerBlobGas: null,
  data: '0x608060405234801561001057600080fd5b50610771806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80632e64cec11461005c5780636057361d1461007a5780636f760f41146100965780638bab8dd5146100b25780639e7a13ad146100e2575b600080fd5b610064610113565b604051610071919061052a565b60405180910390f35b610094600480360381019061008f919061046d565b61011c565b005b6100b060048036038101906100ab9190610411565b610126565b005b6100cc60048036038101906100c791906103c8565b6101b6565b6040516100d9919061052a565b60405180910390f35b6100fc60048036038101906100f7919061046d565b6101e4565b60405161010a929190610545565b60405180910390f35b60008054905090565b8060008190555050565b6001604051806040016040528083815260200184815250908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000155602082015181600101908051906020019061018c9291906102a0565b505050806002836040516101a09190610513565b9081526020016040518091039020819055505050565b6002818051602081018201805184825260208301602085012081835280955050505050506000915090505481565b600181815481106101f457600080fd5b906000526020600020906002020160009150905080600001549080600101805461021d9061063e565b80601f01602080910402602001604051908101604052809291908181526020018280546102499061063e565b80156102965780601f1061026b57610100808354040283529160200191610296565b820191906000526020600020905b81548152906001019060200180831161027957829003601f168201915b5050505050905082565b8280546102ac9061063e565b90600052602060002090601f0160209004810192826102ce5760008555610315565b82601f106102e757805160ff1916838001178555610315565b82800160010185558215610315579182015b828111156103145782518255916020019190600101906102f9565b5b5090506103229190610326565b5090565b5b8082111561033f576000816000905550600101610327565b5090565b60006103566103518461059a565b610575565b90508281526020810184848401111561037257610371610704565b5b61037d8482856105fc565b509392505050565b600082601f83011261039a576103996106ff565b5b81356103aa848260208601610343565b91505092915050565b6000813590506103c281610724565b92915050565b6000602082840312156103de576103dd61070e565b5b600082013567ffffffffffffffff8111156103fc576103fb610709565b5b61040884828501610385565b91505092915050565b600080604083850312156104285761042761070e565b5b600083013567ffffffffffffffff81111561044657610445610709565b5b61045285828601610385565b9250506020610463858286016103b3565b9150509250929050565b6000602082840312156104835761048261070e565b5b6000610491848285016103b3565b91505092915050565b60006104a5826105cb565b6104af81856105d6565b93506104bf81856020860161060b565b6104c881610713565b840191505092915050565b60006104de826105cb565b6104e881856105e7565b93506104f881856020860161060b565b80840191505092915050565b61050d816105f2565b82525050565b600061051f82846104d3565b915081905092915050565b600060208201905061053f6000830184610504565b92915050565b600060408201905061055a6000830185610504565b818103602083015261056c818461049a565b90509392505050565b600061057f610590565b905061058b8282610670565b919050565b6000604051905090565b600067ffffffffffffffff8211156105b5576105b46106d0565b5b6105be82610713565b9050602081019050919050565b600081519050919050565b600082825260208201905092915050565b600081905092915050565b6000819050919050565b82818337600083830152505050565b60005b8381101561062957808201518184015260208101905061060e565b83811115610638576000848401525b50505050565b6000600282049050600182168061065657607f821691505b6020821081141561066a576106696106a1565b5b50919050565b61067982610713565b810181811067ffffffffffffffff82111715610698576106976106d0565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b61072d816105f2565b811461073857600080fd5b5056fea2646970667358221220c87aec3b3d919251ff63d37c506587576a7ef53e239b1962a02d5633ac7cd40764736f6c63430008070033',
  value: 0n,
  chainId: 1337n,
  signature: Signature { r: "0x3d9e6a70ed4ad02ede1a46db7aaac7da0349efcd188eb6c356277305dee896a8", s: "0x321a782ce996759a51ed5d7286e82b31e3828da8038c839273ebab20d0d22bcd", yParity: 1, networkV: null },
  accessList: [],
  blobVersionedHashes: null,
  authorizationList: null
}
```

我们使用 ethers 部署合约，比使用上面这种 tx 更易读，建议还是使用原来的脚本。

## 使用 Ethers.js 与合约交互

查看我们之前编译好的 abi 文件，首先将其格式化成 json 格式：

```json
[
  {
    "inputs": [
      { "internalType": "string", "name": "_name", "type": "string" },
      {
        "internalType": "uint256",
        "name": "_favoriteNumber",
        "type": "uint256"
      }
    ],
    "name": "addPerson",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "name": "nameToFavoriteNumber",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "name": "people",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "favoriteNumber",
        "type": "uint256"
      },
      { "internalType": "string", "name": "name", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "retrieve",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_favoriteNumber",
        "type": "uint256"
      }
    ],
    "name": "store",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

abi 或应用程序二进制接口对于我们处理合约非常重要。如果只给我们的代码（.bin）这个巨大的字节码，任何处理器都很难反编译它或理解我们定义的函数是什么。

[Solidity Decompiler](https://ethervm.io/decompile)

上面这个网站具具有反编译的功能，可以将一些字节码反编译成 solidity，但是并不能完全保证正确。所以，还是使用 abi 比较靠谱。

当我们把这块字节码部署到区块链时，然后我们调用函数，如何函数确实存在，代码将自动允许我们调用这些函数。为了让我们代码知道它们的存在，给它提供 abi 就容易多了。

```solidity
import { ethers } from "ethers";

const createContractFactory = async () => {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0x63754b678510506051d95b5ed5338e4f03b651fb22dcfd26c1a39b68a0fd68c1",
    provider
  );

  const abi = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  return contractFactory;
};

async function main() {
  const contractFactory = await createContractFactory();

  console.log("部署合约中...");

  const contract = await contractFactory.deploy();

  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("合约部署成功！地址:", contractAddress);

  const currentFavoriteNumber = await contract.retrieve();
  console.log("当前最喜欢的数字:", currentFavoriteNumber);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

我们调用过的 retrieve 是 view 函数，不会消耗 Gas。

Solidity 不能使用小数位，JavaScript 也很难处理小数，这就是为什么不使用数字类型的更具体的原因。

```solidity
async function main() {
  const contractFactory = await createContractFactory();

  console.log("部署合约中...");
  const contract = await contractFactory.deploy();

  console.log("等待合约部署完成...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("合约部署成功！地址:", contractAddress);

  const currentFavoriteNumber = await contract.retrieve();
  console.log("当前最喜欢的数字:", currentFavoriteNumber.toString());

  const transactionResponse = await contract.store(10);
  console.log("交易发送成功:", transactionResponse);

  await transactionResponse.wait(1); // 等待交易被确认

  const updatedFavoriteNumber = await contract.retrieve();
  console.log("更新后的最喜欢的数字:", updatedFavoriteNumber.toString());
}
```

> 交易分为两步，一个是发送交易，一个是等待区块落地，即交易回执。

到目前为止，我们已经成功部署一个合约到本地的 ganache 实例。

## 环境变量

目前，我们与区块链的链接和私钥都存储代码中。如果我们将代码推送到 github 或其他代码仓库，会存在密钥泄露的情况。

现在我们可以使用 dotenv 处理环境变量问题，首先创建一个 .env 文件。你可以用它存储敏感信息。

```
PRIVATE_KEY=0xfbbfd7b3b3d2d3ff46042ec8f3fe2dac4b253c90babe52c07d00c901df1db119
```

我们还需要安装名为 dotenv 的 npm 包

```bash
npm install dotenv --save
```

```solidity
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// ...

async function main() {
  const contractFactory = await createContractFactory();

  console.log("部署合约中...");
  const contract = await contractFactory.deploy();

  console.log("等待合约部署完成...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("合约部署成功！地址:", contractAddress);

  const currentFavoriteNumber = await contract.retrieve();
  console.log("当前最喜欢的数字:", currentFavoriteNumber.toString());

  const transactionResponse = await contract.store(10);
  console.log("交易发送成功");

  await transactionResponse.wait(1); // 等待交易被确认

  const updatedFavoriteNumber = await contract.retrieve();
  console.log("更新后的最喜欢的数字:", updatedFavoriteNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

```

现在重新运行代码，可以看到没有任何问题。我们还可以把 RPC 端点也设置到 .env 文件中。然后在代码中使用它。

```solidity
const createContractFactory = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  // ....
}
```

如果我们想分享我们的代码，或将代码传递到 Github，首先要使用 .gitignore 文件忽略提交 .env 文件。

```
.DS_Store

artifacts
bin
.deps

.env.local
.env

node_modules
package-lock.json

dist
```

这样我们提交的代码就不会包含 .env 文件了。

## 私钥管理

如果你不想把你的私钥放在 .env 文件中，你还可以在运行脚本之前在命令行中输入。

```
RPC_URL=[your_rpc_url] RPC_PRIVATE_KEY=[your private key] node deploy.js
```

这样运行和写入 .env 文件是一样的效果。

开发环境的用这样的配置就可以了，因为我们不在意这些密钥是否会被黑掉，因为没人会使用它。
但是当我们转向更加专业的设置后，这就有点危险了。所以怎样才能让这些东西更安全呢？

其实我们还可以把私钥本地加密，然后将加密后的密钥放到本地。这样的话，即使因为某些原因一些人访问我们的电脑或项目，我们的私钥也不会以明文的方式呈现，因为已经被加密过了。

首先我们需要创建一个 `encryptkey.js` 文件，然后继续构建一个脚本来加密私钥。

```env
PRIVATE_KEY=[your private key]
RPC_URL=http://127.0.0.1:7545

PRIVATE_KEY_PASSWORD=password
```

```javascript
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
  const encryptedJsonKey = await wallet.encrypt(
    process.env.PRIVATE_KEY_PASSWORD
  );
  console.log(encryptedJsonKey);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

我们把这个脚本设置好，把我们的密钥进行一次性加密。然后我们可以从工作区的任何地方删除我们的私钥。这样它就就不再是纯文本了。

```json
{"address":"fdd5808db054a27f712a075c0d365dbc787b5450","id":"0df078e1-92b6-4e6f-93f3-58ebc7b43662","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"56ef49a1ab0f1ed882b520094632499f"},"ciphertext":"6d3a80fba009f5ba3296a1077281ce1f0e66dacf279034d33a725e4befd16ff6","kdf":"scrypt","kdfparams":{"salt":"c4b449f02be4472d6f9fa02b4ce73e6f4e0fea90fbba0e07293a298382738356","n":131072,"dklen":32,"p":1,"r":8},"mac":"c189c6296a5cf4c066b8bbbcb87e09a0d190fa81e8d9e107901c062b5467dbfb"}}
```

上面这个 JSON 对象是我们的密钥经过加密的样子，它有 id、version 以及其他的东西。上面所有的内容都是我们的密钥的加密版本。如果有人使用我们电脑，就算看到这个，也需要知道密码来解密这个私钥。

```javascript
fs.writeFileSync("./encryptedKey.json", encryptedJsonKey);
```

将它保存到本地。并在 .gitignore 忽略它。

```
.DS_Store

artifacts
bin
.deps

.env.local
.env

node_modules
package-lock.json

dist

encryptedKey.json
```

现在我们可以修改我们的 deploy.js 脚本。

```javascript
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const createContractFactory = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const encryptedJson = fs.readFileSync("./encryptedKey.json", "utf-8");
  let wallet = ethers.Wallet.fromEncryptedJsonSync(
    encryptedJson,
    process.env.PRIVATE_KEY_PASSWORD
  );
  wallet = wallet.connect(provider);

  const abi = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  return contractFactory;
};
```

这样修改后，我们在 .env 文件中不需要直接使用私钥，不再是明文，而是加密后的密钥。这样，万一有人黑了我们的电脑，他们仍然无法发送新的交易，除非他们知道密码。

还有一件事情，如果有人访问你的电脑，并且你之前在控制台设置过密码，在控制台输入 history，仍然可以在历史记录中看到我们之前设置的密钥，这时候需要用 `history -c` 清除历史记录。

> windows 下上述命令不生效，或者安装一个 git bash，或者使用 linux 命令行。

上面这些其实只是一些最基本的加密和保护你的密钥的方法，有人可能会入侵你的电脑并读取你的加密私钥和所有内容，这并不是没有可能。

后续我们将继续明文的密钥进行演示，你只能使用假密钥或者测试密钥。

记住，永远不要在任何地方以纯文本的形式存放你的私钥或你的助记词。

## 部署合约（测试网、主网）

我们将继续使用 Sepolia 测试网络。

我们只需要一个 RPC URL 和一个私钥，就可以在区块链上开始交易。

我们可以在本地搭建 [ethereum](https://github.com/ethereum/go-ethereum)，然后再连接到我们的 geth 节点。不过在这里我们会使用一个三方 RPC URL，[Alchemy](https://www.alchemy.com/)。

Alchemy 具有节点即服务的功能，它允许我们连接到他们支持的任何区块链。其他备选方案有 QuickNode、Morales 或 Infura。它们都有节点及服务的功能。

创建免费的测试节点，选择 ETH 链，Sepolia 网络，SDK 选择 ethers.js，替换本地的 RPC_URL，然后从 MetaMask 获取私钥，即可部署你的合约。

你可能会等待一段时间，因为我们正在部署到一个测试网络，而不是本地假的区块链。测试网络和真正网络通常需要更长的时间。因为它们需要等待区块传播，以便交易能够成功完成。

> address: 0x497040081aA7f18022Cf48d30C4bA7429CEA7843

合约部署完成后，你可以前往 [sepolia 区块链浏览器](https://sepolia.etherscan.io/) 验证合约地址，并查看交易记录。

## 通过浏览器验证合约

我们可以通过浏览器，上传我们的代码验证合约，验证后效果如下：

[SimpleStorage code](https://sepolia.etherscan.io/address/0x497040081aA7f18022Cf48d30C4bA7429CEA7843#code)

我们并不是必须再 EtherScan 上点击按钮来验证我们的代码，我们还可以通过编程完成合约验证。

## Alchemy 控制面板 & 交易池

Alchemy 可以教会我们许多关于交易的知识，以及有关发生在交易背后的东西，包括一个叫做内存池的概念。

内存池是一个等待的地方，你可以把它当成机场内的候机室。在这你如果是一笔交易，是在等待中被打包确认的。内存池就像等待室，你在等待室等着上飞机。所以你的每笔交易都会有不同的状态。

每个节点都有自己的内存池。区块链是由节点组成的网络进行的，每个节点运行着以太坊软件的电脑都维护着区块链的副本，作为一个开发者，你需要使用这些节点向区块链发起请求。你可以使用 Alchemy 或者使用另一个 RPC 节点，你也可以运行自己的节点。

每个节点除了有一部分区块链状态的副本外，它有一个本地的交易的内存，即内存池。如果有等待被打包的交易，你可以认为它们就在交易池里。
