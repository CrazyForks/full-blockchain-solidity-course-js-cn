# FundMe合约

## Hardhat 配置

```bash
npx hardhat init
```

安装 `solhint`

```bash
npm install solhint --save-dev
```

linting 是运行一个程序的过程，该程序将分析代码是否存在潜在错误，他还会做一些格式化。

ESLint 是一种对 JavaScript 代码进行 lint 的方法，sollint 是一种用于 solidity 代码的 lint 方法。

初始化配置文件
```bash
npx solhint --init
```

```json
{
  "extends": "solhint:recommended"
}
```

你可以指定文件进行 lint：

```bash
npx solhint contracts/*.sol
```

在 hardhat 项目我们可以使用 `hardhat-solhint`，它可以很方便的集成进来并使用：

```bash
npm install --save-dev @nomiclabs/hardhat-solhint

npx hardhat check
```

## 引入 npm

```solidity
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

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

当我们运行 `npx hardhat compile` 就会报错，因为我们找不到这个包。

在 Remix 中会自动获取，在本地开发中需要自主安装：

```bash
npm i @chainlink/contracts
```

安装后，我们再次编译 solhint 代码就没有问题了。

## 项目部署

之前我们使用脚本模块，创建了一个部署脚本。不过，当你使用原生 ethers 或仅仅使用 Hardhat 进行工作，仅仅使用一个部署脚本，跟踪所有部署会是一件很棘手的事情。

此外，把所有部署都放到一个部署脚本中，可能会使测试和部署脚本之间无法完全兼容，还可能遇到其他比较麻烦的事情。

我们可以使用一个包（[hardhat-deploy](https://rocketh.dev/hardhat-deploy/)），它会使我刚才提到的所有事情变得更容易一些。

```bash
npm i hardhat-deploy
```

```javascript
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

export default {
  solidity: "0.8.28"
};
```

未完待续。