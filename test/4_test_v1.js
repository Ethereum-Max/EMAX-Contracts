const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoinV2 = artifacts.require('EMaxCoinV2');
 
const { deployProxy , prepareUpgrade} = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
  await deployProxy(EMaxCoin, [], { deployer, initializer: 'initialize' });
  await prepareUpgrade(EMaxCoin, EMaxCoinV2, { deployer });
};
