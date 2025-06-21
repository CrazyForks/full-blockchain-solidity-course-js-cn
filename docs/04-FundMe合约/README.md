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

我们将如何把以太币转为 USC？这就是预言机的作用。

为了获得以太币的美元价格，我们需要从区块链之外获得信息，返回到以太坊或其他原生智能合约平台。我们可以使用去中心化的预言机网络，来获得 1 个 ETH 的 USD 价格。

之前我们说过，由于区块链是确定性系统，这意味它们自身不能与现实世界和事件交互，它们不知道以太币价格是什么，不知道随机数是什么，不知道天气或者温度。它们不知道任何信息。这些链也不能做任何外部计算。

正如我们提到的，区块链在设计上就是确定性系统，所有节点需要达成共识，如果你想要添加可变数据或者随机数，或者调用API获得返回值，不同节点可能会得到不同的结果，并且它们永远不可能达成共识。这被称为智能合约连接或者预言机问题。这并不是我们想要的，我们希望智能合约能够取代传统协议，传统协议需要数据，以及与现实世界交互。这也是 Chainlink 预言机的使用场景。

区块链预言机就是一种工具，它可以与现实世界交互，给智能合约提供外部数据或计算。

如果使用中心化预言机，会重新引入单点失败风险，Chainlink 所做的很多工作都是为了让逻辑层去中心化。
但如果我们通过中心化节点或通过中心化API获取数据，其实就违背了构建智能合约的初衷。所以我们不想也不能通过中心化节点获取我们的数据或进行外部计算。这不是我们想要的。

Chainlink 是一个解决方案，是一个去中心化的预言机网络，用于将数据和外部计算引入我们的智能合约。它们结合了链上和链下，构建了功能丰富和强大的应用程序。
Chainlink 是一个模块化、去中心化的 Oracle 网络，可定制以传输任何数据或执行你想要的外部计算。

区块链节点无法进行 https 调用，因为它们无法达成共识。如果他们在不同的时间调用节点，或者他们做了其他事情，共识都会无法完成。所以我们需要一个中心化的预言机网络来替代它。然后在交易中，这个网络的节点会将数据传给智能合约。

Chainlink 预言机网络可以完全自定义，从而带来任何你想要的数据和外部计算。Chainlink 有大量的去中心化的开箱即用的功能，可以随时集成到你的智能合约应用程序中。

data feed（喂价）：Chainlink 喂价目前在 Defi 中已为超过 500 亿美元的项目提供服务，它的工作原理是 Chainlink 节点通过去中心化网络，从不同的交易所和数据提供商获取数据，Chainlink 节点使用中位数来计算资产的价格，然后在单个交易中将其传递给参考合约、喂价合约或链上数据合约。这些合约上的数据也可以被其他智能合约使用。

与交易中 Gas 类似，每当节点运营商向智能合约发送数据时，Chainlink 节点运营商都会获得一些通证。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts@1.4.0/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED
 * VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/**
 * If you are reading data feeds on L2 networks, you must
 * check the latest answer from the L2 Sequencer Uptime
 * Feed to ensure that the data is accurate in the event
 * of an L2 sequencer outage. See the
 * https://docs.chain.link/data-feeds/l2-sequencer-feeds
 * page for details.
 */

contract DataConsumerV3 {
    AggregatorV3Interface internal dataFeed;

    /**
     * Network: Sepolia
     * Aggregator: BTC/USD
     * Address: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     */
    constructor() {
        dataFeed = AggregatorV3Interface(
            0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
        );
    }

    /**
     * Returns the latest answer.
     */
    function getChainlinkDataFeedLatestAnswer() public view returns (int) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }
}
```

将合约部署到 Sepolia 测试网络，然后通过合约获取价格信息（Remix JavaScript VM 没有 Chainlink 节点）。

上面是查询 BTC/USD 的地址，你可以切换 ETH/USD，可以在这个列表找到地址。

[price-feeds address](https://docs.chain.link/data-feeds/price-feeds/addresses?page=1&testnetPage=1)

> $2,415.27903102  Sepolia 测试网 ETH/USD 20250621

喂价是 Chainlink 中最强大的去中心化功能之一，你可以使用智能合约对其升级，尤其是在 Defi 领域。

Chainlink 还可以将可证明的随机数引入到我们的合约中，以保证公平和应用程序的随机性。

关于更多功能可以去 Chainlink 的[官方文档](https://docs.chain.link/)查看。

## ABI、Address、interfaces

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

// solhint-disable-next-line interface-starts-with-i
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);

    function description() external view returns (string memory);

    function version() external view returns (uint256);

    function getRoundData(
        uint80 _roundId
    )
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract FundMe {
    // 数据源
    AggregatorV3Interface public dataFeed;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    constructor() {
        /**
         * Network: Sepolia
         * Aggregator: ETH / USD
         * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
         */
        dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    function fund() public payable {
        // 1e18 = 1 * 10 ** 18 = 1 ETH
        require(msg.value >= MINIMUM_USD, unicode"你必须至少转账 50 USD");
    }

    function getPrice() public {}

    // 获取版本号
    function getVersion() public view returns (uint256) {
        return dataFeed.version();
    }

    function getConversionRate() public {}

    function withdraw() public {}
}
```

## 从 Github、NPM 引入合约

[smartcontrackkit](https://github.com/smartcontractkit/chainlink)

[AggregatorV3Interface](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol)


```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    // 数据源
    AggregatorV3Interface public dataFeed;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    constructor() {
        /**
         * Network: Sepolia
         * Aggregator: ETH / USD
         * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
         */
        dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    function fund() public payable {
        // 1e18 = 1 * 10 ** 18 = 1 ETH
        require(msg.value >= MINIMUM_USD, unicode"你必须至少转账 50 USD");
    }

    function getPrice() public {}

    // 获取版本号
    function getVersion() public view returns (uint256) {
        return dataFeed.version();
    }

    function getConversionRate() public {}

    function withdraw() public {}
}
```

使用 import 关键引入地址，remix 会自动解析 npm 仓库，并使用相关代码。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract FundMe {
    // 数据源
    AggregatorV3Interface public dataFeed;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    constructor() {
        /**
         * Network: Sepolia
         * Aggregator: ETH / USD
         * Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
         */
        dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
    }

    // 转账
    function fund() public payable {
        require(
            getConversionRate(msg.value) >= MINIMUM_USD,
            unicode"你必须至少转账 50 USD"
        );
    }

    // 获取价格
    function getPrice() public view returns (uint256) {
        // prettier-ignore
        (
            /* uint80 roundId */,
            int256 answer,
            /*uint256 startedAt*/,
            /*uint256 updatedAt*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        // 1e10 = 10 ** 10 = 10000000000
        // 2428618200000000000000
        // 2428,61820000,0000000000
        return uint256(answer * 1e10);
    }

    // 获取版本号
    function getVersion() public view returns (uint256) {
        return dataFeed.version();
    }

    // 获取转换率
    function getConversionRate(
        uint256 ethAmount
    ) public view returns (uint256) {
        // 2428,61820000,0000000000
        uint256 ethPrice = getPrice();
        // 1 eth = 1 * 10 ** 18 = 1000000000000000000
        // 1,00000000,0000000000
        uint256 ethAmountInUsed = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsed;
    }

    function withdraw() public {}
}
```

## 数组和结构体

