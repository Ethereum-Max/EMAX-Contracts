var HDWalletProvider = require("truffle-hdwallet-provider");
require('dotenv').config();

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  compilers: {
      solc: {
        version: "^0.8.0"
      }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(process.env.ROPSTEN_MNEMONIC, "https://ropsten.infura.io/v3/" + process.env.API_KEY)
      },
      network_id: 3,
      gas: 4000000,      //make sure this gas allocation isn't over 4M, which is the max
      from: "0xe0449fAd286FC646a26Ef335C56efF8E4B89ce8F"
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(process.env.MNEMONIC, "https://mainnet.infura.io/v3/" + process.env.API_KEY)
      },
      network_id: 1,
      gas: 5000000,
      gasPrice: 45000000000 // 45 gwei
    }
  },
  plugins : [
    'truffle-plugin-verify'
  ],
  api_keys: {
    etherscan: process.env.ETHER_SCAN_API
  }
  
};
