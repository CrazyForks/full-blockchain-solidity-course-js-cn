import { ethers } from "./ethers.esm.min.js";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./constants.js";

const connectButton = document.getElementById("J-connectButton");
const fundButton = document.getElementById("J-fundButton");
const status = document.getElementById("J-status");
const withdrawButton = document.getElementById("J-withdrawButton");

const bindEvents = () => {
  connectButton.addEventListener("click", connectWallet);
  fundButton.addEventListener("click", fund);
  withdrawButton.addEventListener("click", withdraw);
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
    console.log("MetaMask 请求用户账户失败！", error);

    updateStatus("MetaMask 连接失败！");
  }
}

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

async function withdraw() {
  if (!isInstalled()) return;

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const transaction = await contract.withdraw();

  await transaction.wait();

  console.log("提现成功！");
}
