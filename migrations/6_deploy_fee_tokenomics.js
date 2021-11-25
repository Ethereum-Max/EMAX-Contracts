const EMaxCoin4 = artifacts.require('EMaxCoin4');
const EMaxCoin5 = artifacts.require('EMaxCoin5');

const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    const deployed = await EMaxCoin4.deployed();
    const instance = await upgradeProxy(deployed.address, EMaxCoin5, { deployer, unsafeAllow: ['delegatecall'] });
    console.log("Upgraded to instance v5: ", instance.address)

    //const instance = await upgradeProxy("0xEBF5D45F982F1618F97C514609B826bd9d47A192", EMaxCoin5, { deployer, unsafeAllow: ['delegatecall'] });
    //console.log("Upgraded to instance v5: ", instance.address)
};
