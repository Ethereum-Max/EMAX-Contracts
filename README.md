# Ethereum Max ERC20 Smart Contracts

## PreRequisites
* Install Chrome, Firefox, Opera
* Install MetaMask
* Install NodeJS

## Deploying to Testnet
For local testing comment out initializer function and uncomment constructor. Also, remove ProxyOwnable inheritance. Revert to the initializer method when migrating with truffle to a testnet or mainnet. 

* **_Single line view_**
	* `git pull --all; npm install; truffle compile; npx truffle migrate --compile-all --network ropsten --reset`
* Execute the command below to pull in all the most recent changes
    * `git pull --all`
* Execute the command below to install all pinned dependencies for project
    * `npm ci`
* Execute the command below to compile smart contracts
    * `truffle compile`
* Execute the command below to deploy to testnet
    * Ropsten: `npx truffle migrate --compile-all --network ropsten --reset`
    * Rinkeby: `npx truffle migrate --compile-all --network rinkeby --reset`

#### Interacting with Testnet contracts
- `truffle console --network rinkeby`
- `const {ethers} = require('ethers')` 
- `const instance = await EMaxCoin5.deployed()` or `let instance = await EMaxCoin5.at("<contractAddress>")`
- `instance.name()`
- `instance.symbol()`
- `instance.balanceOf('address')`
- `instance.transfer(ethers.utils.getAddress("<toAddress>"), ethers.utils.parseEther("amount"))`
- `instance.<VariableName>.call().then(function (res) {console.log(res)})`

#### generating Uniswap Pair contract address for testing

```
address factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
address token0 = 0x15874d65e649880c2614e7a480cb7c9A55787FF6; // mainnet: eMax, rinkeby: address(this)
address token1 = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // mainnet: wETH (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2), rinkeby: wETH (0xc778417E063141139Fce010982780140Aa0cD5Ab)

address pair = address(uint160(uint(keccak256(abi.encodePacked(
    hex'ff',
    factory,
    keccak256(abi.encodePacked(token0, token1)),
    hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
)))));
```

## Deploying to Mainnet

### Perform an Upgrade Test on Ropsten

Do the following to confirm upgrade works as expected:
1. compile the code.
2. deploy to ropsten
3. change the code
4. do some transactions
5. compile the code
6. deploy update to ropsten
7. validate balances
8. do some transactions


#### Things to know:

This is straightforward because you are probably doing a `--reset` so it's a clean deployment, and all deployments are using the same compiler runs and addresses are properly cached.


### Upgrading on Production:
1. compile the code
2. Make a mental note of the latest migration script number (for example: `4` as defined as the latest migration script of `4_deploy_burn`)
3. Be prepared to press ctrl+C to abort the deployment
4. Get ready to press ctrl+C to cancel so you do not deploy a duplicate token
5. Run the deployment, and look for `X_latest_migration.js` being the first migration executed

```
ABORT when you see `1_initial_migration.js` ideally before it even says `Deploying`, as below
```


```
Starting migrations...
======================
> Network name:    'ropsten'
> Network id:      3
> Block gas limit: 8000000 (0x7a1200)


1_initial_migration.js
======================
```

#### Things to know:


1.  `Error: Contract at <0xADDRESS> doesn't look like an EIP 1967 proxy`

Fix:  Look at the migration script this failed on, and either use the `await EMaxCoin.deployed();` approach -OR- update the hardcoded address.

2.  build script calls `const deployed = await EMaxCoin2.deployed();` and it is unable to resolve.

Fix:  hardcode the address instead of `deployed.address`, there is a commented out example in `4_deploy_burn.js`


3.  The migration starts back at step 1_initial_migration.js

Openzeppelin uses data within the `build/contracts/Migrations.json` file.  

This file has a section called `networks`.  As defined in `truffle.config`, mainnet is `network: 1`.  Ropsten is `network:3` and the below still holds (just update )


The source of this information is etherscan - the first transaction made by the origin wallet was to create the migration script when the contract was originally deployed, so we need to use that address and transaction hash.

Update the `networks` json object to ensure it has the following definitions for `network:1`

```
"networks": {
    "1": {
      "events": {},
      "links": {},
      "address": "0x8E64f15F1D8cF6743558F916befa06E41E68224B",
      "transactionHash": "0x6b2285ae58213b1938fe139485d5d65a938fcd85eed1dddbc24a563763ef89d4"
    },
   ...
}
```


## Other Notes
### commands
* Execute the command below to compile scripts
    * `npx truffle compile`
* Execute the command below to do a deployment, but get ganache running locally.
    * `npx truffle migrate`
* Execute the command below to deploy to ropsten
    * `npx truffle migrate --compile-all --network  ropsten --reset`
* Execute the command below to deploy to mainnet
    * `npx truffle migrate --compile-all --network mainnet --reset`
* Execute the command below to run verification
    * `truffle run verify :COIN_NAME --network :NETWORK_NAME`
### tests
* Execute the command below to run tests
    1. launch ganache
    2. `npx truffle test`

### Verify on EtherScan
* Until improved, visit remix.ethereum.org and install the `Flattener` addon.  Import the relevant files into the editor, run the flattener, and clean up compilation errors related to licenses and order of include statements.

Click [here](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#transparent-proxies-and-function-clashes)  to explain the 4 contracts, 'TransparentUpgradeableProxy'

