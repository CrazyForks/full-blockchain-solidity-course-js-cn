import { ethers } from "./ethers.esm.min.js";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants.js";

const connectButton = document.getElementById("J-connectButton");
const fundButton = document.getElementById("J-fundButton");
const status = document.getElementById("J-status");
const withdrawButton = document.getElementById("J-withdrawButton");
const balanceButton = document.getElementById("J-balanceButton");

const bindEvents = () => {
  connectButton.addEventListener("click", connectWallet);
  fundButton.addEventListener("click", fund);
  withdrawButton.addEventListener("click", withdraw);
  balanceButton.addEventListener("click", getBalance);
};

const appEntry = async () => {
  await checkWallet();

  bindEvents();

  console.log("main");
};

document.addEventListener("DOMContentLoaded", appEntry);

// ------------------------------------------------------------

function updateStatus(text) {
  status.textContent = text;
  console.log(text);
}

function isInstalled() {
  return !!window.ethereum;
}

async function checkWallet() {
  if (isInstalled()) {
    updateStatus("MetaMask 已安装！");
  } else {
    updateStatus("MetaMask 未安装！");
  }
}

async function connectWallet() {
  if (!isInstalled()) return;

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    console.log("accounts", accounts);
    console.log("window.ethereum", window.ethereum);
    console.log("ethers", ethers);

    updateStatus("MetaMask 已连接！");
  } catch (error) {
    updateStatus(`MetaMask 连接失败！${error}`);
  }
}

async function fund() {
  if (!isInstalled()) rn;

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
