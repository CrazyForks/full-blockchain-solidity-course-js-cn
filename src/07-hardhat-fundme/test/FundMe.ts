import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("FundMe", function () {
  async function deployFundMeFixture() {
    const MINIMUM_USD = 50 * 1e18;

    const [owner, otherAccount] = await hre.ethers.getSigners();

    const FundMe = await hre.ethers.getContractFactory("FundMe");
    const fundMe = await FundMe.deploy();

    return { fundMe, owner, otherAccount, MINIMUM_USD };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { fundMe, owner } = await loadFixture(deployFundMeFixture);

      expect(await fundMe.owner()).to.equal(owner.address);
    });
  });
});
