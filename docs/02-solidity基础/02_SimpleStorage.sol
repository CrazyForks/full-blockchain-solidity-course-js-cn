// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    // uint256 favoriteNumber;
    uint256 public favoriteNumber;

    function store(uint256 _number) public {
        favoriteNumber = _number;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function add() public pure returns (uint256) {
        return 1 + 1;
    }
}
