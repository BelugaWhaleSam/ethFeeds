import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.getContractFactory("Feeds");
  const feeback = await contract.deploy();

  await feeback.deployed();

  console.log("Counter deployed to:", feeback.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
