// Deploy a testing copy of Macroverse if one is needed.
var RealMath = artifacts.require("macroverse/contracts/RealMath.sol")
var RNG = artifacts.require("macroverse/contracts/RNG.sol")
var MacroverseStarGenerator = artifacts.require("macroverse/contracts/MacroverseStarGenerator.sol")
var MacroverseStarRegistry = artifacts.require("macroverse/contracts/MacroverseStarRegistry.sol")
var MinimumBalanceAccessControl = artifacts.require("macroverse/contracts/MinimumBalanceAccessControl.sol")
var MRVToken = artifacts.require("macroverse/contracts/MRVToken.sol")

module.exports = function(deployer, network, accounts) {
  
  if (network != "live") {
    // We are on a testnet. Deploy a new Macroverse
    
    console.log("On alternative network '" + network + "'; deploying test Macroverse with test universe seed")
    
    deployer.deploy(RealMath)
    deployer.link(RealMath, RNG)
    deployer.deploy(RNG)
    deployer.link(RNG, MacroverseStarGenerator)
    deployer.link(RealMath, MacroverseStarGenerator)

    
    // Deploy the token
    deployer.deploy(MRVToken, accounts[0], accounts[0]).then(function() {
      return deployer.deploy(MinimumBalanceAccessControl, MRVToken.address, web3.toWei(100, "ether"))
    }).then(function() {
      return deployer.deploy(MacroverseStarGenerator, "TestSeed", MinimumBalanceAccessControl.address)
    }).then(function() {
      return deployer.deploy(MacroverseStarRegistry, MRVToken.address, web3.toWei(1000, "ether"))
    }).then(function() {
      console.log("Macroverse deployed!")
      console.log("MacroverseStarGenerator is at " + MacroverseStarGenerator.address)
    })
  } else {
    console.log("On main network; using real Macroverse")
    throw new Error("Main net deployment not yet implemented")
    // TODO: Hack addresses we get from require("macroverse/build/contracts/*.json") into the appropriate Truffle artifacts
  }
}
