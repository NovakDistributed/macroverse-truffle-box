pragma solidity ^0.4.19;

/**
 * File to work around <https://github.com/trufflesuite/truffle/issues/450> by
 * requiring all the contracts we need from our dependencies.
 */

import "macroverse/contracts/RealMath.sol";
import "macroverse/contracts/RNG.sol";
import "macroverse/contracts/MacroverseStarGenerator.sol";
import "macroverse/contracts/MacroverseStarRegistry.sol";
import "macroverse/contracts/MinimumBalanceAccessControl.sol";
import "macroverse/contracts/MRVToken.sol";

