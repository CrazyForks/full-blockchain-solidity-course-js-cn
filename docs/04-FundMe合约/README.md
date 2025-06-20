# FundMe 合约

## 简介

FundMe.sol 是一个智能合约，它可以让人们发起一个众筹。

> 要饭合约

人们可以向该合约发送 ETH、Polygon、Ava、Fantom 或者其他区块链原生通证，然后这个智能合约拥有者可以提取这些通证来做他们想做的事情。

fund、withdraw 函数都是 payable 函数。

withdraw 函数允许用户提取资金，fund 函数允许用户向合约转账。

当我们调用 fund 函数时，可以转一些通证，然后我们可以向这个合约转某个数量的 ETH，或者 wei。然后就可以把资金转到部署的合约中。

还有一个 funders（资助者）的 list（列表）和一个 mapping（映射），映射地址和其发送的资金的数量。我们可以从合约中取出这些资金。只有部署此合约的人才能提取资金。一旦资金被提取，funder 余额将重置为零。

我们还会用 Chainlink 的 price feed（喂价）来设定用户支付的金额，以 usd（美元）而不是 ETH 来作为单位。

## fund 函数实现

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

contract FundMe {
    function fund() public {}

    function withdraw() public {}
}
```

我们发送的每笔交易，都会有以下字段：

Nonce：账户的交易序号
Gas Price：每单位 Gas 的价格
Gas Limit：此交易可使用的最大 Gas 数量
To：交易将要发送的地址
Value：要发送的 Wei 数量
Data：要发送到 To 地址的数据
v,r,s：交易签名的组成部分

在调用函数和部署合约的时候就会发送它。

[以太坊单位转换器](https://eth-converter.com)

为了使函数可以被 ETH 或任何其他通行证支付，我们首先需要将函数设为 payable。

就像我们的钱包可以持有资金，合约地址也可以持有资金，每次部署合约，都可以获得一个合约地址，它与钱包地址几乎一致，所以钱包和合约都可以持有像 ETH 这样的原生区块链通证。

当我们声明 payable 修饰符，可以在函数中使用 msg.value，获取某人转账的金额。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

contract FundMe {
    function fund() public payable {
        // 1e18 = 1 * 10 ** 18 = 1 ETH
        require(msg.value > 1e18, unicode"你必须至少转账 1 ETH");
    }

    function withdraw() public {}
}
```

可以使用 require 关键字配合 msg.value 设置转账最小金额，如果没有满足条件，操作就会回滚，交易会被取消，并将剩余的 gas 返回。本次交易的任何操作都会回滚。

如果在函数内部存在大量计算资源的操作，调用 fund 函数会花费大量的 gas，当交易被 revert 后，所有后续的 gas 将被返回给原用户。

## Chainlink & 预言机

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

contract FundMe {
    uint256 public MINIMUM_USD = 50 * 1e18; // 50 USD

    function fund() public payable {
        // 1e18 = 1 * 10 ** 18 = 1 ETH
        require(msg.value >= MINIMUM_USD, unicode"你必须至少转账 50 USD");
    }

    function withdraw() public {}
}
```

现在我们要求 msg.value 大于等于整个最小的 USD 金额，但是最小 USD 是以美元计算，value 则以 ETH 计算，

