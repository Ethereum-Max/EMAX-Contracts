const EMaxCoin = artifacts.require('EMaxCoin'); 
const EMaxCoinV2 = artifacts.require('EMaxCoinV2'); 
const { admin, prepareUpgrade, deployProxy, admin } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
    await deployProxy(EMaxCoin, [], { deployer, initializer: 'initialize' });
    deployer.deploy(EMaxCoinV2.sol);
    deployed = await EMaxCoin.deployed();
    deployed = await EMaxCoinV2.deployed();
    admin.transferProxyAdminOwnership("0xe0449fAd286FC646a26Ef335C56efF8E4B89ce8F");
};



