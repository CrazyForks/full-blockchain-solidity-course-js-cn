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
    uint256 test03 = 1234;
    // uinit 最低可以设置 8 个字节，最高可以设置 256 个字节

    int test04 = 10;
    int256 test05 = 10;
    // int 最低可以设置 8 个字节，最高可以设置 256 个字节

    string test06 = "TEN";
    // string 最低可以设置 1 个字节，最高可以设置 256 个字节，默认是 256 个字节

    address myAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    // address 最低可以设置 1 个字节，最高可以设置 20 个字节，默认是 20 个字节

    bytes32 test07 = "cat";
    // string 也是一种 bytes，但是 string 只能存储文本，string 可以转换为 bytes32
    // bytes 通常以 “0x” 开头，表示这是一个 bytes 类型，然后有一些随机的数字和字母
    // bytes 最低可以设置 1 个字节，最高可以设置 32 个字节，默认是 32 个字节
}
```

