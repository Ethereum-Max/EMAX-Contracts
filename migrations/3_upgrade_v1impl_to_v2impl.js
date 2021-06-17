
const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoinV2 = artifacts.require('EMaxCoinV2New');
    
const { prepareUpgrade, upgradeProxy } = require('@openzeppelin/truffle-upgrades');
    
module.exports = async function (deployer) {
    const admin = admin.getInstance();

    // https://docs.openzeppelin.com/upgrades-plugins/1.x/api-truffle-upgrades
    const EMaxV2Address = await prepareUpgrade(EMaxCoin, EMaxCoinV2, { deployer }); // determine if necessary?

    const upgraded = upgradeProxy(admin.address, EMaxCoinV2, {deployer});
};


// git pull --all; npm install; truffle compile; npx truffle migrate --compile-all --network ropsten --reset
// 1. reset truffle migrations to remove previous deployment data
// 2. do first deployment by deploying V1 also with proxy
// 3. Do a truffle veriofy on V1 using truffle verify EMax Coin
// 4. New Deployment only Migrations file 3 - `deploy_upgrade.js`
// 5. deploy_upgrade needs to call `upgradeProxy` function with param



// first time run deploy, run lines 1 through 9; transfes ownship
// ensure we own proxdy
// second time, call upgrade proxy, passing in v1 and v2 as args 1 and 2