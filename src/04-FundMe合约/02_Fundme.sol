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
