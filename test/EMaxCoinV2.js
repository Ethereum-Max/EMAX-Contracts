const EMaxCoinV2 = artifacts.require("EMaxCoinV2");

contract('EMaxCoinV2', (accounts) => {
  it('should have the correct name and symbol', async () => {
    const EMaxCoinV2Instance = await EMaxCoinV2.deployed();

    const name = await EMaxCoinV2Instance.name();
    const symbol = await EMaxCoinV2Instance.symbol();

    assert.equal(name, "EthereumMax", " The name changed");
    assert.equal(symbol, "eMax", " The symbol changed");
  });


  it('should have put total minting supply in first account on creation', async () => {
    const EMaxCoinV2Instance = await EMaxCoinV2.deployed();
    const balance = await EMaxCoinV2Instance.balanceOf(accounts[0]);

    assert.equal(balance, 2000000000 * 10**6 * 10**18, "10000 wasn't in the first account");
  });


  it('should send coin correctly', async () => {
    const EMaxCoinV2Instance = await EMaxCoinV2.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // get their balances
    const accountOneStartinBalance = await EMaxCoinV2Instance.balanceOf(accountOne);
    const accountTwoStartinBalance = await EMaxCoinV2Instance.balanceOf(accountTwo);

    //define transfer amount and reflacted rate
    const amount = 10000;
    const reflect = amount * 0.03;
    const reflectedAmount = amount - reflect;
    const burn = amount * 0.03;
    const burnAmount = amount - burn;
    const feeAmount = burnAmount + reflectedAmount;

    //do the transfer
    await EMaxCoinV2Instance.transfer(accountTwo, amount);

    //get the ending balance
    const accountOneEndingBalance = await EMaxCoinV2Instance.balanceOf(accountOne);
    const accountTwoEndingBalance = await EMaxCoinV2Instance.balanceOf(accountTwo);

    //assert coin was sent correctly
    assert.equal(accountOneEndingBalance, accountOneStartinBalance - amount, "Amount was correctly deducted");
    assert.equal(Number(accountTwoEndingBalance), Number(accountTwoStartinBalance) + Number(feeAmount));

  });
});
