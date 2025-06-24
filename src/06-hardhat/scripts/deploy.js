const { ethers } = require("hardhat");

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");
  const simpleStorage = await simpleStorageFactory.deploy();

  console.log("Waiting for deployment...");
  await simpleStorage.waitForDeployment();

  console.log("SimpleStorage deployed to:", simpleStorage.target);

  console.log("SimpleStorage address:", await simpleStorage.getAddress());
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
