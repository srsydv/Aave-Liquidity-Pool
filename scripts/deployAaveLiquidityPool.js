const hre = require("hardhat");

async function main() {
  console.log("deploying...");
  const AaveLiquidityPoolIntegration = await hre.ethers.getContractFactory(
    "AaveLiquidityPoolIntegration"
  );
  const aaveLiquidityPoolIntegration = await AaveLiquidityPoolIntegration.deploy(
    "0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D"
  );

  await aaveLiquidityPoolIntegration.deployed();

  console.log(
    "aaveLiquidityPoolIntegration loan contract deployed: ",
    aaveLiquidityPoolIntegration.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});