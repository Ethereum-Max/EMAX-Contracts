const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoinV2 = artifacts.require('EMaxCoinV2New');
 
const { prepareUpgrade, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
    const EMaxV2Address = await prepareUpgrade(EMaxCoin, EMaxCoinV2, { deployer });
    const upgraded = upgradeProxy(upgradeProxyadd, EmaxV2, {deployer});
    // let EMaxV2 = await EMaxCoinV2.at(EMaxV2Address);
    // await EMaxV2.setBurnRate.call(3);
    // await EMaxV2.setReflectRate.call(3);
    // await EMaxV2.excludeAccount.call(account(0));
    // await EMaxV2.excludeAccount.call('0xe0449fAd286FC646a26Ef335C56efF8E4B89ce8F');
};
