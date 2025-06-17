# Solidity 基础

[Remix](https://remix.ethereum.org/)

## 第一个智能合约

在任何一个 Solidity 智能合约中，你首先需要的就是 Solidity 的使用版本，它应该被标注到 Solidity 代码的最上面。

Solidity 是一个更新频率很高的语言，和别的语言相比，它总是会有新版本。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {}
```

## 基础数据类型

boolean、uint、int、address、bytes

boolean 定义 true 或 false
uint 是无符号整数，表示这个数字不是可正可负的，只能是正数
int 可以表示正数或者负数
address 表示地址

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    // boolean、uint、int、address、bytes

    bool test01 = true;
    uint test02 = 123;
}
```