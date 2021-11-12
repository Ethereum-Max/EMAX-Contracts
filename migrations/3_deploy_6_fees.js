const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoin2 = artifacts.require('EMaxCoin2');

const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  const existing = await EMaxCoin.deployed();
  const owner = await existing.owner()
  console.log("Contract owner: ", owner)
  const instance = await upgradeProxy(existing.address, EMaxCoin2, { deployer, unsafeAllow: ['delegatecall'] });
  console.log("Upgraded to instance v2: ", instance.address)

  //await upgradeProxy("0xBa53E48aEC10fC5474622Af9a699C6637C0EB9Ff", EMaxCoin2, { deployer });
};
