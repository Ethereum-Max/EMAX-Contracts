const EMaxCoin = artifacts.require('EMaxCoin');
const EMaxCoinV2 = artifacts.require('EMaxCoinV2');
 
const { prepareUpgrade, deployProxy } = require('@openzeppelin/truffle-upgrades');
 
module.exports = async function (deployer) {
  // const eMaxV1 = await EMaxCoin;
  // if(eMaxV1){
    await deployProxy(EMaxCoinV2, [], { deployer, initializer: 'initialize' });
    const v1Deployed = await EMaxCoinV2.deployed();
    // console.log(v1Deployed);
  // }else{
    // await prepareUpgrade(EMaxCoin.address, EMaxCoinV2, { deployer});
    // const v2Deployed = await EMaxCoinV2.deployed();
    // console.log(v2Deployed);
  // }
};
