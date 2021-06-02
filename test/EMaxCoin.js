const EMaxCoin = artifacts.require("EMaxCoin");

contract('EMaxCoin', (accounts) => {
  it('should have the correct name and symbol', async () => {
    const EMaxCoinInstance = await EMaxCoin.deployed();

    const name = await EMaxCoinInstance.name();
    const symbol = await EMaxCoinInstance.symbol();

    assert.equal(name, "EthereumMax", " The name changed");
    assert.equal(symbol, "eMax", " The symbol changed");
  });


  it('should have put total minting supply in first account on creation', async () => {
    const EMaxCoinInstance = await EMaxCoin.deployed();
    const balance = await EMaxCoinInstance.balanceOf(accounts[0]);

    assert.equal(balance, 2000000000 * 10**6 * 10**18, "10000 wasn't in the first account");
  });


  it('should send coin correctly', async () => {
    const EMaxCoinInstance = await EMaxCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // get their balances
    const accountOneStartinBalance = await EMaxCoinInstance.balanceOf(accountOne);
    const accountTwoStartinBalance = await EMaxCoinInstance.balanceOf(accountTwo);

    //define transfer amount and reflacted rate
    const amount = 10000;
    const reflect = amount * 0.02;
    const reflectedAmont = amount - reflect

    //do the transfer
    await EMaxCoinInstance.transfer(accountTwo, amount);

    //get the ending balance
    const accountOneEndingBalance = await EMaxCoinInstance.balanceOf(accountOne);
    const accountTwoEndingBalance = await EMaxCoinInstance.balanceOf(accountTwo);

    //assert coin was sent correctly
    assert.equal(accountOneEndingBalance, accountOneStartinBalance - amount, "Amount was correctly deducted");
    assert.equal(Number(accountTwoEndingBalance), Number(accountTwoStartinBalance) + Number(reflectedAmont));

  });
});