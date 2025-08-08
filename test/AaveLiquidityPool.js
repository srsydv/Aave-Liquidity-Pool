const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AaveLiquidityPool", function () {
  let aaveLiquidityPool;
  let owner;
  let user1;
  let user2;
  let mockPoolAddressesProvider;
  let mockPool;
  let mockERC20;

  beforeEach(async function () {
    // Get signers
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy mock contracts
    const MockPoolAddressesProvider = await ethers.getContractFactory("MockPoolAddressesProvider");
    mockPoolAddressesProvider = await MockPoolAddressesProvider.deploy("0x0000000000000000000000000000000000000002");

    const MockPool = await ethers.getContractFactory("MockPool");
    mockPool = await MockPool.deploy();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    mockERC20 = await MockERC20.deploy("Mock Token", "MTK");

    // Deploy AaveLiquidityPool
    const AaveLiquidityPool = await ethers.getContractFactory("AaveLiquidityPool");
    aaveLiquidityPool = await AaveLiquidityPool.deploy(mockPoolAddressesProvider.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await aaveLiquidityPool.owner()).to.equal(owner.address);
    });

    it("Should set the correct addresses provider", async function () {
      expect(await aaveLiquidityPool.ADDRESSES_PROVIDER()).to.equal(mockPoolAddressesProvider.address);
    });
  });

  describe("Supply Liquidity", function () {
    it("Should call pool.supply with correct parameters", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      const amount = ethers.parseEther("100");
      
      await aaveLiquidityPool.supplyLiquidity(tokenAddress, amount);
      
      // Verify that the mock pool's supply function was called
      expect(await mockPool.supplyCalled()).to.be.true;
      expect(await mockPool.lastSupplyAsset()).to.equal(tokenAddress);
      expect(await mockPool.lastSupplyAmount()).to.equal(amount);
    });

    it("Should emit SupplyLiquidity event", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      const amount = ethers.parseEther("100");
      
      await expect(aaveLiquidityPool.supplyLiquidity(tokenAddress, amount))
        .to.emit(aaveLiquidityPool, "SupplyLiquidity")
        .withArgs(tokenAddress, amount);
    });
  });

  describe("Withdraw Liquidity", function () {
    it("Should call pool.withdraw with correct parameters", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      const amount = ethers.parseEther("50");
      
      await aaveLiquidityPool.withdrawlLiquidity(tokenAddress, amount);
      
      // Verify that the mock pool's withdraw function was called
      expect(await mockPool.withdrawCalled()).to.be.true;
      expect(await mockPool.lastWithdrawAsset()).to.equal(tokenAddress);
      expect(await mockPool.lastWithdrawAmount()).to.equal(amount);
    });

    it("Should return the correct amount", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      const amount = ethers.parseEther("50");
      const expectedReturn = ethers.parseEther("45"); // Mock returns 90% of input
      
      const result = await aaveLiquidityPool.withdrawlLiquidity(tokenAddress, amount);
      expect(result).to.equal(expectedReturn);
    });

    it("Should emit WithdrawLiquidity event", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      const amount = ethers.parseEther("50");
      
      await expect(aaveLiquidityPool.withdrawlLiquidity(tokenAddress, amount))
        .to.emit(aaveLiquidityPool, "WithdrawLiquidity")
        .withArgs(tokenAddress, amount);
    });
  });

  describe("Get User Account Data", function () {
    it("Should return user account data", async function () {
      const userAddress = user1.address;
      
      const accountData = await aaveLiquidityPool.getUserAccountData(userAddress);
      
      expect(accountData.totalCollateralBase).to.be.gt(0);
      expect(accountData.totalDebtBase).to.be.gte(0);
      expect(accountData.availableBorrowsBase).to.be.gte(0);
      expect(accountData.currentLiquidationThreshold).to.be.gt(0);
      expect(accountData.ltv).to.be.gte(0);
      expect(accountData.healthFactor).to.be.gte(0);
    });
  });

  describe("LINK Token Operations", function () {
    it("Should approve LINK tokens", async function () {
      const amount = ethers.parseEther("100");
      const poolAddress = mockPool.address;
      
      const result = await aaveLiquidityPool.approveLINK(amount, poolAddress);
      expect(result).to.be.true;
    });

    it("Should return LINK allowance", async function () {
      const poolAddress = mockPool.address;
      
      const allowance = await aaveLiquidityPool.allowanceLINK(poolAddress);
      expect(allowance).to.be.gte(0);
    });
  });

  describe("Get Balance", function () {
    it("Should return token balance", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      const balance = await aaveLiquidityPool.getBalance(tokenAddress);
      expect(balance).to.be.gte(0);
    });
  });

  describe("Withdraw (Owner Only)", function () {
    it("Should allow owner to withdraw tokens", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      
      await expect(aaveLiquidityPool.withdraw(tokenAddress))
        .to.not.be.reverted;
    });

    it("Should not allow non-owner to withdraw tokens", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      
      await expect(
        aaveLiquidityPool.connect(user1).withdraw(tokenAddress)
      ).to.be.revertedWith("Only the contract owner can call this function");
    });

    it("Should emit Withdraw event", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      
      await expect(aaveLiquidityPool.withdraw(tokenAddress))
        .to.emit(aaveLiquidityPool, "Withdraw")
        .withArgs(tokenAddress);
    });
  });

  describe("Receive Function", function () {
    it("Should accept ETH", async function () {
      const amount = ethers.parseEther("1");
      
      await expect(
        owner.sendTransaction({
          to: aaveLiquidityPool.address,
          value: amount
        })
      ).to.not.be.reverted;
    });
  });

  describe("Edge Cases", function () {
    it("Should handle zero amounts", async function () {
      const tokenAddress = "0x0000000000000000000000000000000000000003";
      
      await expect(
        aaveLiquidityPool.supplyLiquidity(tokenAddress, 0)
      ).to.not.be.reverted;
      
      await expect(
        aaveLiquidityPool.withdrawlLiquidity(tokenAddress, 0)
      ).to.not.be.reverted;
    });

    it("Should handle invalid token addresses", async function () {
      const invalidAddress = "0x0000000000000000000000000000000000000000";
      
      await expect(
        aaveLiquidityPool.supplyLiquidity(invalidAddress, ethers.parseEther("100"))
      ).to.not.be.reverted;
    });
  });
});

// Mock contracts for testing
describe("Mock Contracts", function () {
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

    const result = await mockPool.withdraw(asset, amount, to);
    
    expect(await mockPool.withdrawCalled()).to.be.true;
    expect(await mockPool.lastWithdrawAsset()).to.equal(asset);
    expect(await mockPool.lastWithdrawAmount()).to.equal(amount);
    expect(result).to.equal(ethers.parseEther("45")); // 90% of input
  });

  it("MockERC20 should have correct name and symbol", async function () {
    expect(await mockERC20.name()).to.equal("Mock Token");
    expect(await mockERC20.symbol()).to.equal("MTK");
  });
}); 