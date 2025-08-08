const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Simple Mock Tests", function () {
  let mockPoolAddressesProvider;
  let mockPool;
  let mockERC20;

  beforeEach(async function () {
    const MockPoolAddressesProvider = await ethers.getContractFactory("MockPoolAddressesProvider");
    mockPoolAddressesProvider = await MockPoolAddressesProvider.deploy("0x0000000000000000000000000000000000000002");

    const MockPool = await ethers.getContractFactory("MockPool");
    mockPool = await MockPool.deploy();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock Token", "MTK");
  });

  it("MockPoolAddressesProvider should return correct pool address", async function () {
    const poolAddress = await mockPoolAddressesProvider.getPool();
    expect(poolAddress).to.equal("0x0000000000000000000000000000000000000002");
  });

  it("MockPool should track supply calls", async function () {
    const asset = "0x0000000000000000000000000000000000000003";
    const amount = ethers.parseEther("100");
    const onBehalfOf = "0x0000000000000000000000000000000000000004";
    const referralCode = 0;

    await mockPool.supply(asset, amount, onBehalfOf, referralCode);
    
    expect(await mockPool.supplyCalled()).to.be.true;
    expect(await mockPool.lastSupplyAsset()).to.equal(asset);
    expect(await mockPool.lastSupplyAmount()).to.equal(amount);
  });

  it("MockPool should track withdraw calls", async function () {
    const asset = "0x0000000000000000000000000000000000000003";
    const amount = ethers.parseEther("50");
    const to = "0x0000000000000000000000000000000000000004";

    await mockPool.withdraw(asset, amount, to);
    
    expect(await mockPool.withdrawCalled()).to.be.true;
    expect(await mockPool.lastWithdrawAsset()).to.equal(asset);
    expect(await mockPool.lastWithdrawAmount()).to.equal(amount);
  });

  it("MockERC20 should have correct name and symbol", async function () {
    expect(await mockERC20.name()).to.equal("Mock Token");
    expect(await mockERC20.symbol()).to.equal("MTK");
  });

  it("MockPool should return user account data", async function () {
    const userAddress = "0x0000000000000000000000000000000000000005";
    
    const accountData = await mockPool.getUserAccountData(userAddress);
    
    expect(accountData.totalCollateralBase).to.equal(ethers.parseEther("1000"));
    expect(accountData.totalDebtBase).to.equal(ethers.parseEther("500"));
    expect(accountData.availableBorrowsBase).to.equal(ethers.parseEther("300"));
    expect(accountData.currentLiquidationThreshold).to.equal(8000);
    expect(accountData.ltv).to.equal(7500);
    expect(accountData.healthFactor).to.equal(ethers.parseEther("1500"));
  });
}); 