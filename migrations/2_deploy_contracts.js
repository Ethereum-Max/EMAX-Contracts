const EMaxCoin = artifacts.require('EMaxCoin'); 
const { admin, prepareUpgrade, deployProxy, admin } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
    await deployProxy(EMaxCoin, [], { deployer, initializer: 'initialize' });
    const deployed = await EMaxCoin.deployed();
    admin.transferProxyAdminOwnership("0xe0449fAd286FC646a26Ef335C56efF8E4B89ce8F");
};
