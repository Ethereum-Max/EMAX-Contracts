const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoin2 = artifacts.require('EMaxCoin2');
 
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  const deployed = await EMaxCoin.deployed();
  await upgradeProxy(deployed.address, EMaxCoin2, {deployer});

};
