const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoinV2 = artifacts.require('EMaxCoinV2New');
 
const { prepareUpgrade, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
    const EMaxV2Address = await prepareUpgrade(EMaxCoin, EMaxCoinV2, { deployer });
    const upgraded = upgradeProxy(upgradeProxy, EmaxV2, {deployer});
    // let EMaxV2 = await EMaxCoinV2.at(EMaxV2Address);
    // await EMaxV2.setBurnRate.call(3);
    // await EMaxV2.setReflectRate.call(3);
    // await EMaxV2.excludeAccount.call(account(0));
    // await EMaxV2.excludeAccount.call('0xe0449fAd286FC646a26Ef335C56efF8E4B89ce8F');
};



// 1. reset truffle migrations to remove previous deployment data
// 2. do first deployment by deploying V1 also with proxy
// 3. Do a truffle veriofy on V1 using truffle verify EMax Coin
// 4. New Deployment only Migrations file 3 - `deploy_upgrade.js`
// 5. deploy_upgrade needs to call `upgradeProxy` function with param