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

    // 合约拥有者
    address public owner;

    constructor() {
        owner = msg.sender;
    }

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

    // 修饰器
    modifier onlyOwner() {
        require(msg.sender == owner, unicode"你不是合约拥有者");
        _;
    }
}
