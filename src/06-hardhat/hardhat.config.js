require("dotenv").config();

require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");

require("./tasks/block-number");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    currency: "USD",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
