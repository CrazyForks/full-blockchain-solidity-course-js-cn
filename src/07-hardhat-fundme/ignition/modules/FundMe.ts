// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FundMeModule = buildModule("FundMeModule", m => {
  const MINIMUM_USD = m.getParameter("MINIMUM_USD", 50 * 1e18);
  const fundMe = m.contract("FundMe", [MINIMUM_USD]);
  return { fundMe };
});

export default FundMeModule;
