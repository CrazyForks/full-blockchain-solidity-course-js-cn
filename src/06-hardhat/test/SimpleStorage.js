const {
  loadFixture
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("SimpleStorage", function () {
  async function deploySimpleStorageFixture() {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();
    return { simpleStorage };
  }

  describe("Deployment", function () {
    it("Should set the right favoriteNumber", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);
      expect(await simpleStorage.retrieve()).to.equal(0);
    });

    it("Should set the right favoriteNumber after store", async function () {
      const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

      const tx = await simpleStorage.store(123);
      await tx.wait(1);

      expect(await simpleStorage.retrieve()).to.equal(123);
    });
  });

  describe("People", function () {
    describe("Add Person", function () {
      it("Should add a person to the people array", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

        await simpleStorage.addPerson("John", 123);

        const person = await simpleStorage.people(0);
        expect(person.favoriteNumber).to.equal(123);
      });

      it("Should add a person to the people array", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

        await simpleStorage.addPerson("John", 123);
        await simpleStorage.addPerson("Jane", 456);

        const person = await simpleStorage.people(1);
        expect(person.favoriteNumber).to.equal(456);
      });
    });

    describe("NameToFavoriteNumber", function () {
      it("Should add a person to the nameToFavoriteNumber mapping", async function () {
        const { simpleStorage } = await loadFixture(deploySimpleStorageFixture);

        await simpleStorage.addPerson("John", 123);

        expect(await simpleStorage.nameToFavoriteNumber("John")).to.equal(123);
      });
    });
  });
});
