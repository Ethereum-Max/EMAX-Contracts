const EMaxCoin = artifacts.require('EMaxCoin');

 
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
  deployer.deploy(EMaxCoin);

};