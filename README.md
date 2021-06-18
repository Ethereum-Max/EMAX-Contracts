# Ethereum Max


## PreRequisites
* Install Chrome, Firefox, Opera
* Install MetaMask
* Install NodeJS
* Install TruffleJS
* Install Ganache


## Deploying To Test Net
* **_Single line view_**
	* `git pull --all; npm install; truffle compile; npx truffle migrate --compile-all --network ropsten --reset`
* Execute the command below to pull in all the most recent changes
    * `git pull --all`
* Execute the command below to install all dependencies fo project
    * `npm install`
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
    * if you get the error:  `Error: Artifacts are from different compiler runs` do not believe their lies about `--all`, instead, run: 
        * `rm -r build && npx truffle compile` unless that doesn't work then use `--all` as recommeneded.
* Execute the command below to deploy to ropsten
    * `npx truffle migrate --compile-all --network  ropsten --reset`
* Execute the command below to deploy to mainnet
    * `npx truffle migrate --compile-all --network mainnet --reset`
* Execute the command below to run verification
    * `truffle run verify :COIN_NAME --network :NETWORK_NAME`

* Execute the command below to run tests
    1. launch ganache
    2. `npx truffle test`



Click [here](https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#transparent-proxies-and-function-clashes)  to explain the 4 contracts, 'TransparentUpgradeableProxy'
