const EMaxCoin2 = artifacts.require('EMaxCoin2');
const EMaxCoin3 = artifacts.require('EMaxCoin3');
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    const deployed = await EMaxCoin2.deployed();
    await upgradeProxy(deployed.address, EMaxCoin3, { deployer, unsafeAllow: ['delegatecall'] });

    // await upgradeProxy("0x15874d65e649880c2614e7a480cb7c9A55787FF6", EMaxCoin3, {deployer});
};
