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

