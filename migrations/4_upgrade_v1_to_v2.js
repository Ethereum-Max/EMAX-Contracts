
const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoinV2 = artifacts.require('EMaxCoinV2');
    
const { prepareUpgrade } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer, network) {
const EmaxDeployed = await EMaxCoin.deployed();
await prepareUpgrade(EMaxCoin.address, EMaxCoinV2, {deployer});

}