const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployment Test", function () {
  it("Should deploy AaveLiquidityPool successfully", async function () {
    const [owner] = await ethers.getSigners();
    
    // Deploy mock contracts
    const MockPoolAddressesProvider = await ethers.getContractFactory("MockPoolAddressesProvider");
    const mockPoolAddressesProvider = await MockPoolAddressesProvider.deploy("0x0000000000000000000000000000000000000002");

    // Deploy AaveLiquidityPool
    const AaveLiquidityPool = await ethers.getContractFactory("AaveLiquidityPool");
    const aaveLiquidityPool = await AaveLiquidityPool.deploy(mockPoolAddressesProvider.address);
    
    expect(aaveLiquidityPool.address).to.not.equal(ethers.ZeroAddress);
    expect(await aaveLiquidityPool.owner()).to.equal(owner.address);
  });
}); 