var HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  compilers: {
      solc: {
        version: "0.8.4"
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
        return new HDWalletProvider(ROPSTEN_MNEMONIC, "https://ropsten.infura.io/v3/" + API_KEY)
      },
      network_id: 3,
      gas: 4000000,      //make sure this gas allocation isn't over 4M, which is the max
      gasPrice: 45000000000 // 45 gwei 
    },
    mainnet: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://mainnet.infura.io/v3/" + API_KEY)
      },
      network_id: 1,
      gas: 5000000,
      gasPrice: 45000000000 // 45 gwei
    }
  },
  plugins : [
    'truffle-plugin-verify'
  ]
  
};
