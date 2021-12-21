var HDWalletProvider = require("truffle-hdwallet-provider");
const secrets = require('./secrets.json')

const { ethers } = require("ethers");

module.exports = {

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
      provider: function () {
        return new HDWalletProvider(secrets['ROPSTEN_MNEMONIC'], "https://ropsten.infura.io/v3/" + secrets['API_KEY'])
      },
      network_id: 3,
      skipDryRun: true,
      gas: 4000000,
      gasPrice: 70000000000 // 70 gwei 
    },

    rinkeby: {
      provider: function () {
        return new HDWalletProvider(secrets['RINKEBY_MNEMONIC'], "https://rinkeby.infura.io/v3/" + secrets['API_KEY']);
      },
      network_id: 4,
      skipDryRun: true,
      gas: 9500000,
      gasPrice: 20000000000, // 10 gwei
    },

    mainnet: {
      provider: function () {
        return new HDWalletProvider(secrets['MAINNET_MNEMONIC'], "https://mainnet.infura.io/v3/" + secrets['API_KEY'])
      },
      network_id: 1,
      gas: 450000, // 5 million wei for contract deploy
      skipDryRun: true,
      gasPrice: 80000000000 // 120 gwei (120000000000) // current price 
    }
  },

  api_keys: {
    etherscan: process.env.MY_ETHERSCAN_API_TOKEN
  },

  plugins: [
    'truffle-plugin-verify'
  ]

};
