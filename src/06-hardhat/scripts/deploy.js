const { ethers, run, network } = require("hardhat");

async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");

  console.log("Deploying contract...");
  const simpleStorage = await simpleStorageFactory.deploy();

  console.log("Waiting for deployment...");
  await simpleStorage.waitForDeployment();

  console.log("SimpleStorage deployed to:", simpleStorage.target);
  console.log("SimpleStorage address:", await simpleStorage.getAddress());

  if (network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for 6 blocks...");
    await simpleStorage.deploymentTransaction().wait(6);
    console.log("6 blocks confirmed");
    await verify(simpleStorage.target, []);
  }

  const currentValue = await simpleStorage.retrieve();
  console.log("Current value is:", currentValue.toString());

  const transactionResponse = await simpleStorage.store(7);
  await transactionResponse.wait(1);

  const updatedValue = await simpleStorage.retrieve();
  console.log("Updated value is:", updatedValue.toString());
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args
    });

    console.log("Contract verified!");
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Contract already verified!");
    } else {
      console.log("Error verifying contract:", error);
    }
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
