// Deploy a testing copy of Macroverse if one is needed.
var RealMath = artifacts.require("macroverse/RealMath.sol");
var RNG = artifacts.require("macroverse/RNG.sol");
var MacroverseStarGenerator = artifacts.require("macroverse/MacroverseStarGenerator.sol")
var MacroverseStarRegistry = artifacts.require("macroverse/MacroverseStarRegistry.sol")
var MinimumBalanceAccessControl = artifacts.require("macroverse/MinimumBalanceAccessControl.sol")
var MRVToken = artifacts.require("macroverse/MRVToken.sol")

module.exports = async function(deployer, network, accounts) {
  
  if (network != "live") {
    // We are on a testnet. Deploy a new Macroverse
    
    console.log("On alternative network '" + network + "'; deploying test Macroverse with test universe seed")
    
    await deployer.deploy(RealMath)
    deployer.link(RealMath, RNG)
    await deployer.deploy(RNG)
    deployer.link(RNG, MacroverseStarGenerator)
    deployer.link(RealMath, MacroverseStarGenerator)

    // Deploy the token
    await deployer.deploy(MRVToken, accounts[0], accounts[0])
    
    // Deploy a 100 MRV minimum balance access control using it
    await deployer.deploy(MinimumBalanceAccessControl, MRVToken.address, web3.toWei(100, "ether"))
    
    // Deploy the star generator using that
    await deployer.deploy(MacroverseStarGenerator, "TestSeed", MinimumBalanceAccessControl.address)

    // Deploy the star ownership registry, with a 1000 MRV minimum ownership deposit.
    await deployer.deploy(MacroverseStarRegistry, MRVToken.address, web3.toWei(1000, "ether"))
  } else {
    console.log("On main network; using real Macroverse")
  }
};
