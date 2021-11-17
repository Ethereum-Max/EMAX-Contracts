const EMaxCoin = artifacts.require('EMaxCoin');

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  const emaxCoin = await deployProxy(EMaxCoin, [], { deployer, initializer: 'initialize', unsafeAllow: ['delegatecall'] });
  console.log("Deployed EMax coin to: ", emaxCoin.address);
  const owner = await emaxCoin.owner()
  console.log("Contract owner: ", owner)
};
