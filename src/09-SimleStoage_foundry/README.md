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

