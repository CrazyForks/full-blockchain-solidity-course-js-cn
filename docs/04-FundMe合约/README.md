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

```solidity
contract FundMe {
    // 数据源
    AggregatorV3Interface public dataFeed;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    // 捐款人
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

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
        // 1. 检查转账金额是否大于最小转账金额
        require(
            getConversionRate(msg.value) >= MINIMUM_USD,
            unicode"你必须至少转账 50 USD"
        );
        // 2. 将捐款人添加到数组中
        funders.push(msg.sender);
        // 3. 将捐款金额添加到映射中
        addressToAmountFunded[msg.sender] += msg.value;
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
}
```

和 msg.value 一样，msg.sender 也是一个全局关键字，通过这个方法，我们可以追踪所有给我们合约捐助的人。

msg.value 代表有多少 ETH 或其他原生通证被发送；
msg.sender 代表交易或组合信息的发送者，是调用这个函数的地址。

除此之外，我们还可以使用很多的其他变量和函数，可以在 Solidity 文档中查看它们。

当我们使用一个合约，需要 ABI 和合约地址，当编译一个接口，会给我们生成一个最小化 ABI 让我们能够和项目外的合约交互。如果将编译好的接口和地址结合起来，我们就可以调用这个合约在接口上的函数。

Chainlink 喂价可以以去中心化的方式获取真实世界的信息，在上面这个案例中，我们通过一组中心化的 Chainlink 节点获取到 ETH 的 USD 价格。

**Solidity** 的数学计算不能包括小数，我们要牢记这一点，还需要确保使用的单位是正确的，这样计算才有意义。

## 库 Library

我们现在有一些不同的函数去获取和计算价格，其实还有更简单的方式去使用它，那就是 library（库）的概念。

库和智能合约类似，但是你不能声明任何静态变量，也不能发送 ETH。我们可以使用库，给不同的变量增加更多的功能性。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

library PriceConvertor {}
```

库不能有任何静态变量，也不能发送 ETH，一个库的所有函数都是 internal 的。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConvertor {
    // 获取价格
    function getPrice() internal view returns (uint256) {
        AggregatorV3Interface dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
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
    function getVersion() internal view returns (uint256) {
        AggregatorV3Interface dataFeed = AggregatorV3Interface(
            0x694AA1769357215DE4FAC081bf1f309aDC325306
        );
        return dataFeed.version();
    }

    // 获取转换率
    function getConversionRate(
        uint256 ethAmount
    ) internal view returns (uint256) {
        // 2428,61820000,0000000000
        uint256 ethPrice = getPrice();
        // 1 eth = 1 * 10 ** 18 = 1000000000000000000
        // 1,00000000,0000000000
        uint256 ethAmountInUsed = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsed;
    }
}
```

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {PriceConvertor} from "./PriceConvertor.sol";

contract FundMe {
    using PriceConvertor for uint256;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    // 捐款人
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // 转账
    function fund() public payable {
        // 1. 检查转账金额是否大于最小转账金额
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            unicode"你必须至少转账 50 USD"
        );
        // 2. 将捐款人添加到数组中
        funders.push(msg.sender);
        // 3. 将捐款金额添加到映射中
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public {}
}
```

将通用函数提取到外部，可以极大简化 FundMe 合约。

## SafeMath, Overflow checkikng 和_unchecked_关键字


[openzeppelin-contracts math](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/utils/math)

SafeMath.sol 是 0.8 版本之前，SafeMath 已经无处不在，但是目前的合约中几乎已经看不到它了。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract SafeMathTester {
    uint8 public bigNumber = 255;
}
```

uint8 类型变量可以设置的最大值应该是 255，也是我们能给 uint8 赋值的最大值。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

contract SafeMathTester {
    uint8 public bigNumber = 255;

    function add() public {
        bigNumber += 1;
    }
}
```

当我们调用 add 函数，bigNumber 被重置为 0。

在 Solidity 0.8 版本之前，无符号整型和整型是运行在 unchecked 这个概念下的，这意味着如果你超过一个数字的上限，它只会绕回去并从可能的最低数字开始。

SafeMath 库，它会进行基础检查，确保不会发生上面的现象，如果你已经达到这个数字的最大值，交易将会失败。如果我们将 Solidity 版本切换至 0.8 版本，不会发生上限的问题。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract SafeMathTester {
    uint8 public bigNumber = 255;

    function add() public {
        bigNumber += 1;
    }
}
```

在 Solidity 8.0 版本中，它们会自动检查以确保您是否要对变量执行所谓的溢出或下溢。不过我们也可以使用 unchecked 关键字恢复至 unchecked 版本。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract SafeMathTester {
    uint8 public bigNumber = 255;

    function add() public {
        unchecked {
            bigNumber += 1;
        }
    }
}
```

unchecked 关键字可以让你的代码更省 gas，但是你需要确保使用的数字永远不会到达数字的上限或下限。这样的话，unchecked 关键字才是对你有意义的。

## For loop

for 循环是一种将某种类型的索引对象进行循环的方式将某些范围内的数字进行循环的方法。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {PriceConvertor} from "./PriceConvertor.sol";

contract FundMe {
    using PriceConvertor for uint256;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    // 捐款人
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // ...

    function withdraw() public {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
    }
}
```

## 重置数组

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {PriceConvertor} from "./PriceConvertor.sol";

contract FundMe {
    using PriceConvertor for uint256;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    // 捐款人
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // ...

    function withdraw() public {
        // 1. 重置数据
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // 2. 重置数组
        funders = new address[](0);
    }
}
```

`new address[](0)` 就可以重置数组，现在 funders 已经是一个全新的数组了。

我们已经重置数组，现在我们还需要从这个合约中提取资金。

要想发送以太币或者其他区块链原生货币，有三种不同的方式可以使用，分别是 transfer、send、call。

transfer 是最简单的，也是最直观的。

```solidity
payable(msg.sender).transfer(address(this).balance);
```

这种方法也可以用于不同合约之间互相发送代币。

我们只需要把想要发送的目标地址放到 payable 关键字里，并且告诉它我们要转移多少资金。

[sending-ether](https://solidity-by-example.org/sending-ether/)

但是 transfer 存在一些自身的问题，存在上限 2300 gas，如果超出这个上限，就会报错。

send 方法消耗上限同样也是 2300 gas。

```solidity
bool sendSuccess = payable(msg.sender).send(address(this).balance);
require(sendSuccess, unicode"转账失败");
```

如果运行失败，通过 require 语句回滚交易。transfer 运行失败，会自动回滚交易。

call 是 solidity 中实际使用的较为底层的命令，甚至不需要依赖 ABI。

call 和 send 比较类似。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {PriceConvertor} from "./PriceConvertor.sol";

contract FundMe {
    using PriceConvertor for uint256;

    // 最小转账金额 50 USD
    uint256 public MINIMUM_USD = 50 * 1e18;

    // 捐款人
    address[] public funders;
    mapping(address => uint256) public addressToAmountFunded;

    // 转账
    function fund() public payable {
        // 1. 检查转账金额是否大于最小转账金额
        require(
            msg.value.getConversionRate() >= MINIMUM_USD,
            unicode"你必须至少转账 50 USD"
        );
        // 2. 将捐款人添加到数组中
        funders.push(msg.sender);
        // 3. 将捐款金额添加到映射中
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public {
        // 1. 重置数据
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        // 2. 重置数组
        funders = new address[](0);
        // 3. 转账
        // prettier-ignore
        (
          bool callSuccess,
          /* bytes memory dataReturned */
        ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, unicode"转账失败");
    }
}
```

目前来说，call 是最推荐的发送和接收以太币或其他区块链原生货币的方式。

## 构造函数

我们已经完成 withdraw 函数，但是还存在一个问题，现在无论是谁都可以从这个合约中提款。
任何人出资，这是我们想要的，但我们并不希望随便谁都能捐款，我们只想让募集资金的人能够真正提取资金。

```solidity
// 合约拥有者
address public owner;

constructor() {
    owner = msg.sender;
}
```

## Modifier

```solidity
// 提取资金
function withdraw() public {
    // 1. 检查是否是合约拥有者
    require(msg.sender == owner, unicode"你不是合约拥有者");
    // 2. 重置数据
    for (
        uint256 funderIndex = 0;
        funderIndex < funders.length;
        funderIndex++
    ) {
        address funder = funders[funderIndex];
        addressToAmountFunded[funder] = 0;
    }
    // 3. 重置数组
    funders = new address[](0);
    // 4. 转账
    // prettier-ignore
    (
      bool callSuccess,
      /* bytes memory dataReturned */
    ) = payable(msg.sender).call{
        value: address(this).balance
    }("");
    require(callSuccess, unicode"转账失败");
}
```

我们通过上面这个简单操作可以保证 withdraw 函数只能被这个合约的拥有者所调用。

现在假设我们有很多函数，都要求只能由合约的拥有者来调用，这时我们可以使用修饰器（Modifier）。

```solidity
modifier onlyOwner() {
    require(msg.sender == owner, unicode"你不是合约拥有者");
    _;
}
```

```solidity
// 提取资金
function withdraw() public onlyOwner {
    // 1. 重置数据
    for (
        uint256 funderIndex = 0;
        funderIndex < funders.length;
        funderIndex++
    ) {
        address funder = funders[funderIndex];
        addressToAmountFunded[funder] = 0;
    }
    // 2. 重置数组
    funders = new address[](0);
    // 3. 转账
    // prettier-ignore
    (
      bool callSuccess,
      /* bytes memory dataReturned */
    ) = payable(msg.sender).call{
        value: address(this).balance
    }("");
    require(callSuccess, unicode"转账失败");
}
```

这个函数声明的 onlyOwner 会在执行 withdraw 代码之前执行。

现在我们已经实现了 FundMe 的所有功能，可以在测试网运行了。

## Solidity 进阶 - Immutable & Constant

有两个关键字可以使你的变量不能被改变，这些关键字就是 constant（变量）和 immutable（不可变的），你可以从 Solidity 文档中了解更多关于它们的信息。

如果你只是在函数外分配一次变量，然后永远都不再改变它，如果是在编译时分配的，你就可以继续添加这个 constant 关键字。

```solidity
// 最小转账金额 50 USD
uint256 public constant MINIMUM_USD = 50 * 1e18;
```

当你添加 constant 关键字后，这个 MINIMUM_USD 不再占用一个存储空间，而且更容易被读。部署合约时，也会更加节省 gas。

这种 Gas 的差异可能不会有太大影响，但是像以太坊网络这样更昂贵的链上，这将会产生很大的差异。

```solidity
// 合约拥有者
address public immutable i_owner;

constructor() {
    i_owner = msg.sender;
}
```

像 owner 这种需要被一次性的设置，但在被声明的同一行之外，如果我们在构造函数中设置它们，我们可以将其标记为 immutable 不可变的。

通常，一个好的 immutable 变量命令约定，需要使用 i_* 的格式命名。这样我们就知道这些都是不可变的变量。

immutable 声明的变量也有非常类似 constant 关键字节省 Gas 的效果。

当涉及到存储变量，这两种方式节省 Gas 的原因是，我们并不是把这些变量存储在一个存储槽里面，而是直接把它们存储到合约的字节码中。

## Solidity 进阶 - Custom Error

小的 Gas 效率改进，将是贯穿整个课程的概念之一。

```solidity
require(msg.sender == i_owner, unicode"你不是合约拥有者");
```

目前，require 语句必须要把 “你不是合约拥有者” 存储为一个 string 字符串数组。
这个错误日志中的每一个字符都需要单独被存储，尽管它不是很大，但比我们能做到的替代方案大很多。

从 Solidity v0.8.4 版本开始，你可以使用自定义错误。对于我们的 revert 来说，我们可以在顶部声明它们。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import {PriceConvertor} from "./PriceConvertor.sol";

error FundMe__NotOwner();

contract FundMe {

    // ...

    modifier onlyOwner() {
        // require(msg.sender == i_owner, unicode"你不是合约拥有者");
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }
}
```

因为这些 custom error 在 Solidity 中是非常新的用法，所以你要习惯用两种方式来写。

如果你想比 require 更省 Gas 的话，你可以将所有的 require 语句都更新为 custom error。
revert 关键字所作的事情，与之前没有判断条件时完全一样。

## Solidity 进阶 - Receive & Fallback

有时可以直接将 ETH 或原生通证发送给智能合约，而不执行某一个具体函数来发送通证。

```solidity
// 转账
function fund() public payable {
    // 1. 检查转账金额是否大于最小转账金额
    require(
        msg.value.getConversionRate() >= MINIMUM_USD,
        unicode"你必须至少转账 50 USD"
    );
    // 2. 将捐款人添加到数组中
    funders.push(msg.sender);
    // 3. 将捐款金额添加到映射中
    addressToAmountFunded[msg.sender] += msg.value;
}
```

我们可以在不调用 fund 函数的情况下，向合约发送资金。但是，如果我这样做的话，这时会发生什么？

fund 函数不被触发， 我们就无法跟踪那个 funder，我们就不会在这个合约中更新那个人的信息。因此，如果以后我们想给予奖励或什么，那就没办法在不知道的情况下给合约发送资金。我们也不能给他们任何凭证或其他东西。

此外，也许他们调用了错误的函数，或者并不是使用 MetaMask，或者其他工具通知他们，这个交易会失败。

在这种情况下我们能做什么呢？如果有人在没有调用 fund 函数的情况下，给个合约发送 ETH 比特币，会发生什么？

在 Solidity 中有两个特殊的函数，一个叫做 receive、一个是 fallback。一个合约最多可以有一个使用 receive 函数，声明为 `receive() external payable {...}`，不需要使用 function 关键字。这个函数不能有参数并且不能返回任何东西。必须是 external 以及 payable 函数。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract FallbackExample {
    uint256 public result;

    receive() external payable {}
}
```

我们不需要为 receive 添加 function 关键字，因为 Solidity 知道，receive 就是一个特殊的函数，只要我们发送 ETH 或向这个合约发送交易，只要有与该交易相关的数据，这个 receive 函数就会被触发。

fallback 函数与 receive 函数非常相似，不同的是，即使数据与交易一起被发送，它也会被触发。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract FallbackExample {
    uint256 public result;

    receive() external payable {
        result = 1;
    }

    fallback() external payable {
        result = 2;
    }
}
```

调用逻辑如下：

1. 如果 msg.data 为空，会检测 receive 函数，如果函数不存在，调用 fallback 函数，存在则直接执行 receive 函数；
2. 如果 msg.data 不为空，则直接调用 fallback 函数。

我们将其应用于我们的 FundMe 合约。

```solidity
receive() external payable {
    fund();
}

fallback() external payable {
    fund();
}
```

使用 receive 和 fallback，可以记录那些不小心调用错误的函数或不小心给这个合约发送钱，而不是正确的使用 fund 函数。不过如果直接调用 fund 函数，实际会消耗更少的 Gas。

## 总结

迄今为止，我们已经学习了大多数 Solidity 的基础知识，下面是我们还没有学到的东西。

1. Enums 枚举
2. Events 事件
3. Try / Catch
4. Function Selectors 函数选择器
5. abi.encode / decode abi 编码、解码
6. Hashing 哈希
7. Yul / Assumbly

没有深入这些内容，是因为它们的用法比较高级，后面我们再了解它们的用途会更有意义。

