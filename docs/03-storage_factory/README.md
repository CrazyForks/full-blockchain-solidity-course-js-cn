# Storage Factory

## 引入其他合约

我们已经实现过 SimpleStorage.sol。

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

contract SimpleStorage {
    uint256 favoriteNumber;

    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    mapping(string => uint256) public nameToFavoriteNumber;

    function store(uint256 _favoriteNumber) public virtual {
        favoriteNumber = _favoriteNumber;
    }

    function retrieve() public view returns (uint256) {
        return favoriteNumber;
    }

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}

```

我们还可以使用一个合约来为我们部署其他合约。并且可以使用它和部署的这些合约交互。合约之间的互相交互，使用 Solidity 和智能合约工作中必须可少的一部分。这就是合约的可组合性。

智能合约是可组合的，它们可以轻易地的互相交互。当我们构建 Defi 应用时，这些特性尤其重要。
复杂的金融产品可以非常轻易的互相交互，因为所有的合约代码在链上都可用。

现在，保持 SimpleStorage 合约不变，我们创建一个名为 StorageFactory 的新合约。

```solidity

```