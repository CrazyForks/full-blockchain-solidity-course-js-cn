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
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

import "./SimpleStorage.sol";

contract StorageFactory {
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }
}
```

一个合约可以部署另一个合约。可以使用 import 引入其他合约。

import 关键字可以指定其他文件的路径，也可以指定其他包或者 Github 的路径。

我们开发的合约可以存在不同的 solidity 版本，但是需要保证版本兼容。

## 与其他合约交互

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

import "./SimpleStorage.sol";

contract StorageFactory {
    SimpleStorage[] public simpleStorageArray;

    function createSimpleStorageContract() public {
        SimpleStorage simpleStorage = new SimpleStorage();
        simpleStorageArray.push(simpleStorage);
    }

    function sfStore(
        uint256 _simpleStorageIndex,
        uint256 _simpleStorageNumber
    ) public {
        simpleStorageArray[_simpleStorageIndex].store(_simpleStorageNumber);
    }

    function sfGet(uint256 _simpleStorageIndex) public view returns (uint256) {
        return simpleStorageArray[_simpleStorageIndex].retrieve();
    }
}
```

和其他的合约交互，需要合约地址和合约ABI（应用程序二进制接口）。

ABI 告诉我们的代码如何跟合约进行交互。ABI 记录所有不同的输入和输出，即这个合约能做的所有事情。

## 继承和重载

```solidity
// SPDX-License-Identifier: MIT

pragma solidity 0.8.30;

import "./SimpleStorage.sol";

contract ExtraStorage is SimpleStorage {
    function store(uint256 _favoriteNumber) public override {
        favoriteNumber = _favoriteNumber + 5;
    }
}
```

如果你想让一个合约能继承另一个合约的所有功能，可以把它导入，并使用 is 指定继承关系。

override：复写父合约的方法（函数重写），需要使用 override 关键字
virtual：定义函数可以被重写，需要使用 virtual 关键字

## 总结

使用 new 关键字在一个合约种部署另一个合约；
使用 import 关键字导入其他合约；
使用 is 关键字继承其他合约；
使用 override 关键字重写父合约函数的实现，父函数必须声明 virtual 修饰符。
