# Ethereum Max


## PreRequisites
* Install Chrome, Firefox, Opera
* Install MetaMask
* Install NodeJS


## Deploying To Test Net
* **_Single line view_**
	* `git pull --all; npm install; truffle compile; npx truffle migrate --compile-all --network ropsten --reset`
* Execute the command below to pull in all the most recent changes
    * `git pull --all`
* Execute the command below to install all pinned dependencies for project
    * `npm ci`
* Execute the command below to compile smart contracts
    * `truffle compile`
* Execute the command below to deploy to testnet
    * `npx truffle migrate --compile-all --network ropsten --reset`

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
