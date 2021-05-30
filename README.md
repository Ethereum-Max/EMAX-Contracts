Ethereum Max
============


## commands

`npx truffle compile` will compile scripts


`npx truffle migrate` will do a deployment, but get ganache running locally!  I got it working with the windows app, not on the linux subsystem btw.



if you get the error:  `Error: Artifacts are from different compiler runs` do not believe their lies about -all, instead, run: 

`rm -r build && npx truffle cmopile` unless that doesn't work then use -all as recommeneded.



https://docs.openzeppelin.com/upgrades-plugins/1.x/proxies#transparent-proxies-and-function-clashes to explain the 4 contract, 'TransparentUpgradeableProxy'


to deploy to ropsten:
`truffle deploy --network ropsten`


`npx truffle compile --all && npx truffle deploy --network mainnet`