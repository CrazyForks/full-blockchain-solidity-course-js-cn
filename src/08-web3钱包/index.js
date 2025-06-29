import { ethers } from "./ethers.esm.min.js";

const connectButton = document.getElementById("J-connectButton");
const fundButton = document.getElementById("J-fundButton");
const status = document.getElementById("J-status");

const bindEvents = () => {
  connectButton.addEventListener("click", connectWallet);
  fundButton.addEventListener("click", fund);
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

async function fund() {}
