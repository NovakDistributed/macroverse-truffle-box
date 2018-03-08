// Deploy a testing copy of Macroverse if one is needed.

// TODO: We can't get ahold of contracts from dependencies with artifact.require
// See https://github.com/trufflesuite/truffle/issues/450
// To work around this we deploy the contracts manually with truffle-contract from their JSON in the macroverse module.
// TODO: We still need to get the deployed addresses out to user code.
var contract = require("truffle-contract");
var RealMath = contract(require("macroverse/build/contracts/RealMath.json"));
RealMath.setProvider(web3.currentProvider);
var RNG = contract(require("macroverse/build/contracts/RNG.json"));
RNG.setProvider(web3.currentProvider);
var MacroverseStarGenerator = contract(require("macroverse/build/contracts/MacroverseStarGenerator.json"));
MacroverseStarGenerator.setProvider(web3.currentProvider);
var MacroverseStarRegistry = contract(require("macroverse/build/contracts/MacroverseStarRegistry.json"));
MacroverseStarRegistry.setProvider(web3.currentProvider);
var MinimumBalanceAccessControl = contract(require("macroverse/build/contracts/MinimumBalanceAccessControl.json"));
MinimumBalanceAccessControl.setProvider(web3.currentProvider);
var MRVToken = contract(require("macroverse/build/contracts/MRVToken.json"));
MRVToken.setProvider(web3.currentProvider);

module.exports = async function(deployer, network, accounts) {
  
  if (network != "live") {
    // We are on a testnet. Deploy a new Macroverse
    
    console.log("On alternative network '" + network + "'; deploying test Macroverse with test universe seed")
    
    // We can't use the Truffle deployer with the contracts we imported from JSON.
    // Do everything via truffle-contract instead

    var params = {from: accounts[0], gas: 4712388, gasPrice: 100000000000}

    var RealMathDeployed = await RealMath.new(params)
    console.log("RealMath at " + RealMathDeployed.address)
    RNG.setNetwork(web3.version.network)
    RNG.link("RealMath", RealMathDeployed.address)
    var RNGDeployed = await RNG.new(params)
    console.log("RNG at " + RNGDeployed.address)
    MacroverseStarGenerator.setNetwork(web3.version.network)
    MacroverseStarGenerator.link("RNG", RNGDeployed.address)
    MacroverseStarGenerator.link("RealMath", RealMathDeployed.address)

    // Deploy the token
    MRVTokenDeployed = await MRVToken.new(accounts[0], accounts[0], params)
    console.log("MRVToken at " + MRVTokenDeployed.address)
    
    // Deploy a 100 MRV minimum balance access control using it
    MinimumBalanceAccessControlDeployed = await MinimumBalanceAccessControl.new(MRVTokenDeployed.address, web3.toWei(100, "ether"), params)
    console.log("MinimumBalanceAccessControl at " + MinimumBalanceAccessControlDeployed.address)

    // Deploy the star generator using that
    MacroverseStarGeneratorDeployed = await MacroverseStarGenerator.new("TestSeed", MinimumBalanceAccessControlDeployed.address, params)
    console.log("MacroverseStarGenerator at " + MacroverseStarGeneratorDeployed.address)

    // Deploy the star ownership registry, with a 1000 MRV minimum ownership deposit.
    MacroverseStarRegistryDeployed = await MacroverseStarRegistry.new(MRVTokenDeployed.address, web3.toWei(1000, "ether"), params)
    console.log("MacroverseStarRegistry at " + MacroverseStarRegistryDeployed.address)

    // TODO: Printed addresses need to be communicated to user code; we don't have artifacts to update.

    // We probably should use a workaround contract that includes all the
    // contracts (so we have access to Truffle artifacts), use normal Truffle
    // deployment on the freshly built contracts, and just hack the mainnet
    // addresses from the dependency JSON files into the local artifacts when
    // running against the mainnet.
  
  } else {
    console.log("On main network; using real Macroverse")
    console.log("RealMath at " + (await RealMath.deployed()).address)
    console.log("RNG at " + (await RNG.deployed()).address)
    console.log("MacroverseStarGenerator at " + (await MacroverseStarGenerator.deployed()).address)
    console.log("MRVToken at " + (await MRVToken.deployed()).address)
    console.log("MinimumBalanceAccessControl at " + (await MinimumBalanceAccessControl.deployed()).address)
    console.log("MacroverseStarGenerator at " + (await MacroverseStarGenerator.deployed()).address)
    console.log("MacroverseStarRegistry at " + (await MacroverseStarRegistry.deployed()).address)
  }
};
