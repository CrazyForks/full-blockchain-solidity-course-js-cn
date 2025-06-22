import { ethers } from "ethers";
import fs from "fs";

async function main() {
  // 1. 连接到区块链
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
  const wallet = new ethers.Wallet(
    "0x63754b678510506051d95b5ed5338e4f03b651fb22dcfd26c1a39b68a0fd68c1",
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

  // 5. 等待部署完成
  await contract.waitForDeployment();

  // 6. 获取合约地址
  const contractAddress = await contract.getAddress();
  console.log("合约部署成功！地址:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
