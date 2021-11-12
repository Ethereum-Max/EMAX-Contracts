const EMaxCoin4 = artifacts.require('EMaxCoin4');
const EMaxCoin5 = artifacts.require('EMaxCoin5');

const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    const deployed = await EMaxCoin4.deployed();
    const instance = await upgradeProxy(deployed.address, EMaxCoin5, { deployer, unsafeAllow: ['delegatecall'] });
    console.log("Upgraded to instance v5: ", instance.address)

    // await upgradeProxy("0x15874d65e649880c2614e7a480cb7c9A55787FF6", EMaxCoin4, {deployer});
};
