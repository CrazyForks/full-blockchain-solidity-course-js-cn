# Web3钱包、钱包交互

当你在构建 Dapp 或者能够连接到区块链的网站时，通常你都会有两个代码库。其中一个用于智能合约，同时还会有一个前端项目。这两个代码的结合就构成所谓的全栈应用。

web 3 全栈 = 智能合约 + 前端项目

我们可以安装 Live Server 插件启动 html 文件，也可以使用 live-server npm 包。

```bash
# 初始化 package.json
npm init -y

# 安装
npm i live-server --save-dev

# 启动
npx live-server
```

我们可以查看 [官方文档](https://docs.metamask.io) 了解如何连接 MetaMask 钱包。

## 连接账户

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web3钱包、钱包交互</title>
  </head>
  <body>
    <div class="container">
      <button id="connectButton" onclick="connectWallet()">连接钱包</button>

      <button id="sendTransactionButton">发送交易</button>

      <p id="status"></p>
    </div>

    <script src="index.js"></script>
  </body>
</html>
```

```javascript
function updateStatus(text) {
  document.getElementById("status").textContent = text;
  console.log(text);
}

async function checkWallet() {
  if (!window.ethereum) {
    updateStatus("MetaMask 未安装！");
  } else {
    updateStatus("MetaMask 已安装！");
  }
}

async function connectWallet() {
  if (!window.ethereum) return;

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    console.log("accounts", accounts);

    updateStatus("MetaMask 已连接！");
  } catch (error) {
    console.log("MetaMask 请求用户账户失败！", error);

    updateStatus("MetaMask 连接失败！");
  }
}

checkWallet();
```

## 发送交易

要发送一笔交易，我们需要以下内容：

1. provider：用来连接到区块链
2. signer/wallet：一个具有 gas 的人，用来发送交易
3. contract：能够与之交互的合约
4. abi & Address：发送地址

ethers CDN 地址如下：https://app.unpkg.com/ethers@5.6.0/files/dist

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web3钱包、钱包交互</title>
  </head>
  <body>
    <div class="container">
      <p id="J-status"></p>

      <button id="J-connectButton">连接钱包</button>
      <button id="J-fundButton">发送交易</button>
      <button id="J-withdrawButton">提现</button>
    </div>

    <script type="module" src="index.js"></script>
  </body>
</html>
```

```javascript
async function fund(ethAmount) {
  if (!isInstalled()) return;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();
  console.log("signer", signer);

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const transaction = await contract.fund({
    value: ethers.utils.parseEther("0.05") // 0.05 ETH
  });

  await transaction.wait();

  console.log("交易成功！");
}
```

## 事件监听、完成交易

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web3钱包、钱包交互</title>
  </head>
  <body>
    <div class="container">
      <p id="J-status"></p>

      <button id="J-connectButton">连接钱包</button>

      <div style="margin: 20px 0">
        <label for="J-ethAmount">ETH</label>
        <input type="text" id="J-ethAmount" placeholder="0.05" />
        <button style="margin-left: 10px" id="J-fundButton">发送交易</button>
      </div>

      <button id="J-withdrawButton">提现</button>
    </div>

    <script type="module" src="index.js"></script>
  </body>
</html>
```

```javascript
async function fund() {
  if (!isInstalled()) {
    updateStatus("MetaMask 未安装！");
    return;
  }

  const ethAmount = document.getElementById("J-ethAmount").value;
  if (ethAmount === "") {
    updateStatus("请输入金额！");
    return;
  }

  console.log("ethAmount", ethAmount);

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    console.log("signer", signer);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const transaction = await contract.fund({
      value: ethers.utils.parseEther(ethAmount) // 0.05 ETH
    });

    await lsitenForTransactionMine(transaction, provider);

    updateStatus("交易成功！");
  } catch (error) {
    updateStatus(`交易失败！${error}`);
  }
}

function lsitenForTransactionMine(transactionResponse, provider) {
  updateStatus(`监听交易 ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, transactionReceipt => {
      updateStatus(`交易完成！${transactionReceipt.confirmations}`);
      resolve();
    });
  });
}
```

## 读取区块链数据

```javascript
async function getBalance() {
  if (!isInstalled()) return;

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const balance = await provider.getBalance(CONTRACT_ADDRESS);

    updateStatus(`总余额：${ethers.utils.formatEther(balance)} ETH`);
  } catch (error) {
    updateStatus(`查询余额失败！${error}`);
  }
}
```

## 提现

```javascript
async function withdraw() {
  if (!isInstalled()) return;

  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );

    const transaction = await contract.withdraw();

    await lsitenForTransactionMine(transaction, provider);

    updateStatus("提现成功！");
  } catch (error) {
    updateStatus(`提现失败！${error}`);
  }
}
```
