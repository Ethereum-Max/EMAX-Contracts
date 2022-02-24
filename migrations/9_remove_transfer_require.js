const EMaxCoin7 = artifacts.require('EMaxCoin7');
const EMaxCoin8 = artifacts.require('EMaxCoin8');

const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    const deployed = await EMaxCoin7.deployed();
    const instance = await upgradeProxy(deployed.address, EMaxCoin8, { deployer, unsafeAllow: ['delegatecall'] });
    console.log("Upgraded to instance v8: ", instance.address)

    //const instance = await upgradeProxy("0x15874d65e649880c2614e7a480cb7c9A55787FF6", EMaxCoin8, { deployer, unsafeAllow: ['delegatecall'] });
    //console.log("Upgraded to instance v8: ", instance.address)
};
