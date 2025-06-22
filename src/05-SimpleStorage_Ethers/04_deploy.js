import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const createContractFactory = async () => {
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const abi = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.abi",
    "utf-8"
  );
  const binary = fs.readFileSync(
    "./dist/contracts_SimpleStorage_sol_SimpleStorage.bin",
    "utf-8"
  );

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

  return contractFactory;
};

async function main() {
  const contractFactory = await createContractFactory();

  console.log("部署合约中...");
  const contract = await contractFactory.deploy();

  console.log("等待合约部署完成...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("合约部署成功！地址:", contractAddress);

  const currentFavoriteNumber = await contract.retrieve();
  console.log("当前最喜欢的数字:", currentFavoriteNumber.toString());

  const transactionResponse = await contract.store(10);
  console.log("交易发送成功");

  await transactionResponse.wait(1); // 等待交易被确认

  const updatedFavoriteNumber = await contract.retrieve();
  console.log("更新后的最喜欢的数字:", updatedFavoriteNumber.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
