const EMaxCoin = artifacts.require('EMaxCoin'); 
//const EMaxCoinV2 = artifacts.require('EMaxCoinV2'); 
const { prepareUpgrade, deployProxy, admin } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer, network) {
    await deployProxy(EMaxCoin, [], { deployer, initializer: 'initialize' });
    //deployer.deploy(EMaxCoinV2.sol);
    const deployed1 = await EMaxCoin.deployed();
    //const deployed2 = await EMaxCoinV2.deployed();
};



