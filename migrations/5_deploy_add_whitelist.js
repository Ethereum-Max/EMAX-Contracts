const EMaxCoin4 = artifacts.require('EMaxCoin4');
const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
    await upgradeProxy("0x15874d65e649880c2614e7a480cb7c9A55787FF6", EMaxCoin4, {deployer});
};
