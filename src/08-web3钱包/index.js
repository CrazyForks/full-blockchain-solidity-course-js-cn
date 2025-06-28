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
