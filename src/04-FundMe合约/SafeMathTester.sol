// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract SafeMathTester {
    uint8 public bigNumber = 255;

    function add() public {
        bigNumber += 1;
    }

    function addUnchecked() public {
        unchecked {
            bigNumber += 1;
        }
    }
}
