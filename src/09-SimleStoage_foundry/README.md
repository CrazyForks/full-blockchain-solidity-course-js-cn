# Foundry SimleStoage

[foundry](https://www.foundry.com/) 是最受欢迎的智能合约开发框架之一，类似于 [hardhat](https://hardhat.org/) 或 [brownie](https://doc.confluxnetwork.org/docs/overview)。它以速度而闻名，foundry 是智能合约开发框架中最快的之一。

foundry 与 hardhat 基于 javascript 不同，brownie 基于 python，foundry 完全基于 solidity。所以，我们不需要学习其他编程预言。

## 环境配置

### wsl

> Windows 电脑需要安装 wsl，可选。

微软近些年确实增加对开发者的支持，但是对于智能合约开发时，有一个更好的选项就是 wsl。

Windows 子系统为 linux。智能合约开发通常涉及与基于 Unix 环境中常见的工具和实用程序一起工作。Windows 在适用开发者方面已经取了很大进展。但在运行某些命令行工具和设置正确的开发环境方便，仍然存在一些挑战。其实，Mac 和 Linux 更适合你的开发需求。

wsl 可以安装一个 linux 分发版，这是 wsl 的亮点。

```bash
wsl --install
```

安装完成后，会要求你重启操作系统。重启后，会自动打开终端，安装过程将会继续。

我们需要输入我们的 Unix 用户名和密码， 然后回车确认就可以。 

### foundry 安装

```bash
curl -L https://foundry.paradigm.xyz | bash
``` 

```bash
# 配置环境变量
source /Users/heora/.zshenv

# 写入环境变量到 .bash_profile (可选 )
echo "source /Users/heora/.zshenv" >> .bash_profile
```

```bash
# 安装 foundry
foundryup
```

每次你想更新 foundry，你就可以运行 `foundryup` 命令。

foundry 包含四个组件，forge、cast、anvil、chisel。

如果我们运行 `forge --version` 就可以得到下面的输出：

```
forge Version: 1.2.3-stable
Commit SHA: a813a2cee7dd4926e7c56fd8a785b54f32e0d10f
Build Timestamp: 2025-06-08T15:42:50.507050000Z (1749397370)
Build Profile: maxperf
```
 
## 项目初始化

```bash
# 初始化
forge init

# 初始化（覆盖安装）
forge init --force
```

### solidity 代码高亮、格式化

安装 Solidity 插件（Solidity and Hardhat support by the Hardhat team）。虽然 Hardhat 是另一个框架，但是也可以很好的格式化 foundry 代码。 

Command + Shift + P，打开用户设置，配置默认格式化插件。

```json
"[solidity]": {
  "editor.defaultFormatter": "NomicFoundation.hardhat-solidity"
}
```

下面是我们的 solidity 代码。

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

### TOML 文件高亮

安装 `Better TOML` vscode 插件， 用来高亮展示 `foundry.toml` 文件。

```toml
[profile.default]
src = "src"
out = "out"
libs = ["lib"]

# See more config options https://github.com/foundry-rs/foundry/blob/master/crates/config/README.md#all-options
```
 
## 编译 Foundry

```bash
forge build

# or

forge compile
```

这会编译我们的代码， 并输出 `abi` 到 out 目录下。

## 添加自定义网络

foundry 内置了一个虚拟环境在 shell 中， 如果你运行 `anvil`，会启动一个本地开发环境。并且会得到虚拟的账户和私钥。你还可以得到一个钱包助记词。

我们还可以使用 [trufflesuite](https://archive.trufflesuite.com/docs/) 的 Ganache。
Ganache 是 trufflesuite 套装的一部分，不过它正在逐步被弃用，我们更推荐使用 `anvil`。

我们可以将这个地址添加到 MetaMask 的自定义网络中。

> Anvil 的 ChainID 是 31337。

```
Localhost
127.0.0.1:8545
31337
ETH
```

添加自定义网络后， 可以在本地网络列表看到它。不过在这个自定义网络中， 我们没有 NFT、没有活动。

当然你也可以自己运行 etherum 节点，使用开源的 go-ethereum 项目进行部署。你可以去查看官网文档，使用 api 或者其他方式去连接自定义节点。

## 部署合约到本地环境

我们可以使用两种方式部署合约，一种是命令行的方式，运行以下命令：

```bash
forge create SimpleStorage --interactive --broadcast
```

然后输入你的 private key，就可以部署合约。

你也可以指定 RPC 网络，部署合约：

```bash
forge create SimpleStorage --rpc-url http://127.0.0.1:8545 --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d --broadcast
```

不过我们很不推荐直接粘贴 private key 到 shell 中， 我们不应该让我们的私钥以明文方式存在，尤其是我们实际正在使用的私钥。

如果像上面这样运行，我们可以使用 `history` 命令很轻易的获取到 private key，我们可以输入 `history -c` 清除历史记录。

## 环境变量

之前的教程中，我们使用过 dotenv 读取 env 文件，加载环境变量，现在我们不推荐这么做。 

我们可以利用 foundry 内置的功能来使用私钥， 并且不以明文的方式存在。

```bash
cast wallet import defaultKey --interactive 
```

> `defaultKey` keystore was saved successfully. Address: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

我们可以使用 `cast wallet list` 查看已保存的密钥。另外我们还可以生成一个密钥文件进行存储，但是也不建议上传到远程仓库

## 脚本部署 

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {SimpleStorage} from "../src/SimpleStorage.sol";

contract DeploySimpleStorage is Script {
  function run() external returns (SimpleStorage) {
    vm.startBroadcast();
    SimpleStorage simpleStorage = new SimpleStorage();
    vm.stopBroadcast();
    return simpleStorage;
  }
}
```

`vm` 是 Forge 标准库中的关键字， 也是 Foundry 中唯一可以使用的关键字。

我们可以运行以下命令部署：

```bash
forge script script/DeploySimpleStorage.s.sol
```

```
[⠊] Compiling...
[⠔] Compiling 16 files with Solc 0.8.30
[⠑] Solc 0.8.30 finished in 494.89ms
Compiler run successful!
Script ran successfully.
Gas used: 511337

== Return ==
0: contract SimpleStorage 0x7FA9385bE102ac3EAc297483Dd6233D62b3e1496

If you wish to simulate on-chain transactions pass a RPC URL.
```
 
如果我们并没有指定 RPC Url，它会自动在临时的 anvil chain 上部署你的合约或运行你的脚本。

```bash
forge script script/DeploySimpleStorage.s.sol --rpc-url 127.0.0.1:8545
```

我们还可以添加 `broadcast` 执行真正的部署操作，并添加 `private key` 指定签名交易的账户私钥，

```bash
forge script script/DeploySimpleStorage.s.sol --rpc-url 127.0.0.1:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## run-latest

```json
{
  "transactions": [
    {
      "hash": "0x6f59688ffbadb6314b89d59c72f6512f353a59fe5ca84b05eca050a6743ed8f1",
      "transactionType": "CREATE",
      "contractName": "SimpleStorage",
      "contractAddress": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
      "function": null,
      "arguments": null,
      "transaction": { 
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": "0xac458",
        "value": "0x0",
        "input": "0x6080604052348015600e575f5ffd5b506108db8061001c5f395ff3fe608060405234801561000f575f5ffd5b5060043610610055575f3560e01c80632e64cec1146100595780636057361d146100775780636f760f41146100935780638bab8dd5146100af5780639e7a13ad146100df575b5f5ffd5b610061610110565b60405161006e919061029f565b60405180910390f35b610091600480360381019061008c91906102f3565b610118565b005b6100ad60048036038101906100a8919061045a565b610121565b005b6100c960048036038101906100c491906104b4565b6101a5565b6040516100d6919061029f565b60405180910390f35b6100f960048036038101906100f491906102f3565b6101d2565b60405161010792919061055b565b60405180910390f35b5f5f54905090565b805f8190555050565b6001604051806040016040528083815260200184815250908060018154018082558091505060019003905f5260205f2090600202015f909190919091505f820151815f0155602082015181600101908161017b9190610786565b5050508060028360405161018f919061088f565b9081526020016040518091039020819055505050565b6002818051602081018201805184825260208301602085012081835280955050505050505f915090505481565b600181815481106101e1575f80fd5b905f5260205f2090600202015f91509050805f015490806001018054610206906105b6565b80601f0160208091040260200160405190810160405280929190818152602001828054610232906105b6565b801561027d5780601f106102545761010080835404028352916020019161027d565b820191905f5260205f20905b81548152906001019060200180831161026057829003601f168201915b5050505050905082565b5f819050919050565b61029981610287565b82525050565b5f6020820190506102b25f830184610290565b92915050565b5f604051905090565b5f5ffd5b5f5ffd5b6102d281610287565b81146102dc575f5ffd5b50565b5f813590506102ed816102c9565b92915050565b5f60208284031215610308576103076102c1565b5b5f610315848285016102df565b91505092915050565b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61036c82610326565b810181811067ffffffffffffffff8211171561038b5761038a610336565b5b80604052505050565b5f61039d6102b8565b90506103a98282610363565b919050565b5f67ffffffffffffffff8211156103c8576103c7610336565b5b6103d182610326565b9050602081019050919050565b828183375f83830152505050565b5f6103fe6103f9846103ae565b610394565b90508281526020810184848401111561041a57610419610322565b5b6104258482856103de565b509392505050565b5f82601f8301126104415761044061031e565b5b81356104518482602086016103ec565b91505092915050565b5f5f604083850312156104705761046f6102c1565b5b5f83013567ffffffffffffffff81111561048d5761048c6102c5565b5b6104998582860161042d565b92505060206104aa858286016102df565b9150509250929050565b5f602082840312156104c9576104c86102c1565b5b5f82013567ffffffffffffffff8111156104e6576104e56102c5565b5b6104f28482850161042d565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f61052d826104fb565b6105378185610505565b9350610547818560208601610515565b61055081610326565b840191505092915050565b5f60408201905061056e5f830185610290565b81810360208301526105808184610523565b90509392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f60028204905060018216806105cd57607f821691505b6020821081036105e0576105df610589565b5b50919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f600883026106427fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610607565b61064c8683610607565b95508019841693508086168417925050509392505050565b5f819050919050565b5f61068761068261067d84610287565b610664565b610287565b9050919050565b5f819050919050565b6106a08361066d565b6106b46106ac8261068e565b848454610613565b825550505050565b5f5f905090565b6106cb6106bc565b6106d6818484610697565b505050565b5b818110156106f9576106ee5f826106c3565b6001810190506106dc565b5050565b601f82111561073e5761070f816105e6565b610718846105f8565b81016020851015610727578190505b61073b610733856105f8565b8301826106db565b50505b505050565b5f82821c905092915050565b5f61075e5f1984600802610743565b1980831691505092915050565b5f610776838361074f565b9150826002028217905092915050565b61078f826104fb565b67ffffffffffffffff8111156107a8576107a7610336565b5b6107b282546105b6565b6107bd8282856106fd565b5f60209050601f8311600181146107ee575f84156107dc578287015190505b6107e6858261076b565b86555061084d565b601f1984166107fc866105e6565b5f5b82811015610823578489015182556001820191506020850194506020810190506107fe565b86831015610840578489015161083c601f89168261074f565b8355505b6001600288020188555050505b505050505050565b5f81905092915050565b5f610869826104fb565b6108738185610855565b9350610883818560208601610515565b80840191505092915050565b5f61089a828461085f565b91508190509291505056fea2646970667358221220f647b33da24774807608fc65c932ecd1ce2b8d2e80b6e7699bf02bba7f290bcc64736f6c634300081e0033",
        "nonce": "0x1",
        "chainId": "0x7a69"
      },
      "additionalContracts": [],
      "isFixedGasLimit": false
    }
  ],
  "receipts": [
    {
      "status": "0x1",
      "cumulativeGasUsed": "0x84844",
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "type": "0x2",
      "transactionHash": "0x6f59688ffbadb6314b89d59c72f6512f353a59fe5ca84b05eca050a6743ed8f1",
      "transactionIndex": "0x0",
      "blockHash": "0xac1ed855d9cdad5b61e9157a7e38a20c7c64d86f34959e250dcc1bafebad85f9",
      "blockNumber": "0x3",
      "gasUsed": "0x84844",
      "effectiveGasPrice": "0x2e1b9b20",
      "blobGasPrice": "0x1",
      "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      "to": null,
      "contractAddress": "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
    }
  ],
  "libraries": [],
  "pending": [],
  "returns": {
    "0": {
      "internal_type": "contract SimpleStorage",
      "value": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    }
  },
  "timestamp": 1751321547,
  "chain": 31337,
  "commit": "880a728"
}
```

`transaction` 是我们真正发送到链上的内容，当我们执行脚本或创建时，就会发送它们。 

我们可以运行 `cast --to-base [value] dec` 轻松将十六进制和数字相关转换。它可以将十六进制转换为十进制的值。

```bash
cast --to-base 0x7a69 dec
```

我们需要私钥来实际签署我们构建的事务，每当我们发送一个事务，都会有一个签名产生，我们签署一个事务，然后发送它。

每当你发送一笔交易时，你都需要一个 `nonce`，这个数字只有一次，用来计数你的交易。如果你想重放交易，就可以发送相同的交易数据，携带相同的 nonce。

每当你从链上改变状态时，都是通过交易来完成。不同之处在于 `transaction.data` 字段。 
