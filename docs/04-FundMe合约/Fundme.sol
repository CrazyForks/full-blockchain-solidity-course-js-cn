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
