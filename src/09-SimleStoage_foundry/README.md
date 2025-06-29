# Foundry SimleStoage

[foundry](https://www.foundry.com/) 是最受欢迎的智能合约开发框架之一，类似于 [hardhat](https://hardhat.org/) 或 [brownie](https://doc.confluxnetwork.org/docs/overview)。它以速度而闻名，foundry 是智能合约开发框架中最快的之一。

foundry 与 hardhat 基于 javascript 不同，brownie 基于 python，foundry 完全基于 solidity。所以，我们不需要学习其他编程预言。

## wsl

微软近些年确实增加对开发者的支持，但是对于智能合约开发时，有一个更好的选项就是 wsl。

Windows 子系统为 linux。智能合约开发通常涉及与基于 Unix 环境中常见的工具和实用程序一起工作。Windows 在适用开发者方面已经取了很大进展。但在运行某些命令行工具和设置正确的开发环境方便，仍然存在一些挑战。其实，Mac 和 Linux 更适合你的开发需求。

wsl 可以安装一个 linux 分发版，这是 wsl 的亮点。

```bash
wsl --install
```

安装完成后，会要求你重启操作系统。重启后，会自动打开终端，安装过程将会继续。

## foundry 安装

```bash
curl -L https://foundry.paradigm.xyz | bash
```

```bash
foundryup
```

