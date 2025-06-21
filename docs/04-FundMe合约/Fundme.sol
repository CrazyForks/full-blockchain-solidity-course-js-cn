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
