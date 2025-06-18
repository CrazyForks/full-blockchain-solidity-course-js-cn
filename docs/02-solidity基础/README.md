# Solidity 基础

[Remix](https://remix.ethereum.org/)

## 第一个智能合约

在任何一个 Solidity 智能合约中，你首先需要的就是 Solidity 的使用版本，它应该被标注到 Solidity 代码的最上面。

Solidity 是一个更新频率很高的语言，和别的语言相比，它总是会有新版本。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {}
```

## 基础数据类型

boolean、uint、int、address、bytes

boolean 定义 true 或 false
uint 是无符号整数，表示这个数字不是可正可负的，只能是正数
int 可以表示正数或者负数
address 表示地址

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    // boolean、uint、int、address、bytes

    bool test01 = true;
    // 如果只声明，不赋值，则默认值为 false，会自动转换为 false

    uint test02 = 123;
    uint256 test03 = 1234;
    // uinit 最低可以设置 8 个字节，最高可以设置 256 个字节
    // 如果只声明，不赋值，则默认值为 0，会自动转换为 0

    int test04 = 10;
    int256 test05 = 10;
    // int 最低可以设置 8 个字节，最高可以设置 256 个字节
    // 如果只声明，不赋值，则默认值为 0，会自动转换为 0

    string test06 = "TEN";
    // string 最低可以设置 1 个字节，最高可以设置 256 个字节，默认是 256 个字节
    // 如果只声明，不赋值，则默认值为空字符串，会自动转换为空字符串

    address myAddress = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;
    // address 最低可以设置 1 个字节，最高可以设置 20 个字节，默认是 20 个字节
    // 如果只声明，不赋值，则默认值为 0x0000000000000000000000000000000000000000

    bytes32 test07 = "cat";
    // string 也是一种 bytes，但是 string 只能存储文本，string 可以转换为 bytes32
    // bytes 通常以 “0x” 开头，表示这是一个 bytes 类型，然后有一些随机的数字和字母
    // bytes 最低可以设置 1 个字节，最高可以设置 32 个字节，默认是 32 个字节
    // 如果只声明，不赋值，则默认值为 0x0000000000000000000000000000000000000000
}
```

## 函数

函数或者方法指的是独立模块，在我们调用的时候会执行某些指令。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    uint256 favoriteNumber;

    function store(uint256 _number) public {
        favoriteNumber = _number;
    }
}

// 0xd9145CCE52D386f254917e481eB44e9943F39138
```

每个智能合约都有自己的地址，这个地址是合约的唯一标识
部署一个合约其实就是发送一个交易，这个交易会包含合约的代码，然后会执行合约的构造函数
我们在区块链上做任何事情，修改任何状态，都会产生一个交易，部署一个合约就修改了区块链，让链上拥有这个合约

如果我们在 Rinkeby、Kovan 或者主网上发送这个交易，我们要需要支付 gas 来部署合约。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    // uint256 favoriteNumber;
    uint256 public favoriteNumber;

    function store(uint256 _number) public {
        favoriteNumber = _number;
    }
}
```

函数和变量有 4 种可见度标识符，public、private、external、internal。

public 会创建 storage 和 state 变量的 getter 函数。
private 表示只有这个合约可以调用这个函数，只对合约内部可见
external 表示只对合约外部可见
internal 表示只有这个合约或者继承它的合约可以读取

参数加下划线，是为了区分这个参数和全局变量不同。

每次调用 store 函数，都会发送一个交易（每次更改区块链状态的时候，我们都会发送交易），Remix 控制台可以看到所有交易细节。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    // uint256 favoriteNumber;
    uint256 public favoriteNumber;

    function store(uint256 _number) public {
        favoriteNumber = _number;
        favoriteNumber += 1;
    }
}
```

每个区块链计算 gas 的方式不同，最简单的理解就是，做越多的操作，就会消耗更多的 gas。

代码示例中，favoriteNumber 是全局作用域，在所有括号中的任何函数，都可以获取到它。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    // uint256 favoriteNumber;
    uint256 public favoriteNumber;

    function store(uint256 _number) public {
        favoriteNumber = _number;
        uint256 testVar = 5;
    }

    function something() public {
        testVar = 6; // Undeclared identifier.
    }
}
```

当你创建一个变量时，它只有在这个作用域可见。

```solidity
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
```

Solidity 中有两个关键字，表示函数的调用是否需要消耗 gas。这两个关键字是 view 和 pure。

如果一个函数是 view 函数，意味我们只会读取这个合约的状态。view 函数不允许修改任何状态。
pure 函数也不允许修改状态，但是 pure 也不允许读取区块链数据，所以我们也不能读取到 favoriteNumber 的值。

> pure 关键字类似 js 中的纯函数的概念。

这种 pure 声明的，可能是常用的方法，或者某个不需要读取数据的算法。

单纯调用 pure、view 关键字声明的函数不会消耗 gas，因为只是读取区块链的值。
如果一个要改变区块链状态的函数调用了类似 retrieve 这种 view 或 pure 函数，才会消耗 gas。

## 数据和结构体

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // People public person01 = People({favoriteNumber: 2, name: "John"});
    // People public person02 = People({favoriteNumber: 3, name: "Jane"});

    People[] public people;
}
```

上面这种类型的数据就是动态数组，因为我们在初始化的时候并没有规定它的大小。

```solidity
People[3] public people;
```

这种写法意味着数组只能放进去 3 个 People 对象。如果不设定大小表示可以是任意大小，并且数组的大小会随着我们添加和减少 People 增大或减小面积。

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    struct People {
        uint256 favoriteNumber;
        string name;
    }

    // People public person01 = People({favoriteNumber: 2, name: "John"});
    // People public person02 = People({favoriteNumber: 3, name: "Jane"});

    People[] public people;

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        // people.push(People({favoriteNumber: _favoriteNumber, name: _name}));
        people.push(People(_favoriteNumber, _name));
    }
}
```

函数参数的位置必须是 “storage”，“memory” 或者 “calldata”。

> 代码警告不会阻止你的代码进行编译，它们通常会提供关于如何改进你的智能合约非常有见地的信息

## Memory、Storage、calldata

目前，在 Solidity 中有 6 种方式可以存储数据：Stack、Memory、Storage、CallData、Code、Logs。

calldata 和 memory 意味着这个变量只是暂时存在。
storge 存在于正在执行的函数之外，例如我们在全局声明变量，就会自动分配为一个存储变量。

calldata 是不能被修改的临时变量，memory 是可以被修改的临时变量，storage 是可以被修改的永久变量。

尽量我们说有 6 种方式可以让我们访问和存储信息，但我们不能说一个变量是 Stack、Code 或 Logs。

```solidity
function addPerson(string memory _name, uint256 _favoriteNumber) public {
    // people.push(People({favoriteNumber: _favoriteNumber, name: _name}));
    people.push(People(_favoriteNumber, _name));
}
```

uint256 不需要显示声明，solidity 可以自动推断其所在位置，对于这个变量，仅仅存在于内存中。

strin 其实上是有点复杂的，从背后远离来说，一个 string 实际上是一个 bytes 数组。由于 string 是数组，所以我们需要添加 memory 关键字。需要让 solidity 知道，数组、结构或映射的数据位置。

函数形参不能声明为 storage，变量实际并没有存储到任何地方。

## Mappings

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract SimpleStorage {
    struct People {
        uint256 favoriteNumber;
        string name;
    }

    People[] public people;

    mapping(string => uint256) public nameToFavoriteNumber;

    function addPerson(string memory _name, uint256 _favoriteNumber) public {
        people.push(People(_favoriteNumber, _name));
        nameToFavoriteNumber[_name] = _favoriteNumber;
    }
}
```

## 部署合约

