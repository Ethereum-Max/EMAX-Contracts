const EMaxCoin6 = artifacts.require('EMaxCoin6');
const EMaxCoin7 = artifacts.require('EMaxCoin7');

const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    const deployed = await EMaxCoin6.deployed();
    const instance = await upgradeProxy(deployed.address, EMaxCoin7, { deployer, unsafeAllow: ['delegatecall'] });
    console.log("Upgraded to instance v7: ", instance.address)

    //const instance = await upgradeProxy("0x15874d65e649880c2614e7a480cb7c9A55787FF6", EMaxCoin7, { deployer, unsafeAllow: ['delegatecall'] });
    //console.log("Upgraded to instance v7: ", instance.address)
};
