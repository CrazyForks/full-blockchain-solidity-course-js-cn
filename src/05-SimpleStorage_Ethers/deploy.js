import { ethers } from "ethers";
import fs from "fs";

async function main() {
  // 1. 连接到区块链
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0xcbb685f0c94ea9c41b0da4625258e4741222c8c16b00b3c4f12718cfafd62b0b",
    provider
  );

  // 2. 读取 ABI 和二进制文件
  const abi = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  // 3. 创建合约工厂
  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  console.log("部署合约中...");

  // 4. 部署合约
  const contract = await contractFactory.deploy();

  console.log(contract);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
