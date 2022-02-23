const EMaxCoin8 = artifacts.require('EMaxCoin8');
const EMaxCoin9 = artifacts.require('EMaxCoin9');

const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    //const deployed = await EMaxCoin8.deployed();
    //const instance = await upgradeProxy(deployed.address, EMaxCoin9, { deployer, unsafeAllow: ['delegatecall'] });
    //console.log("Upgraded to instance v9: ", instance.address)

    //UNCOMMENT for Mainnet.
    const instance = await upgradeProxy("0x15874d65e649880c2614e7a480cb7c9A55787FF6", EMaxCoin9, { deployer, unsafeAllow: ['delegatecall'] });
    console.log("Upgraded to instance v9: ", instance.address)
};
