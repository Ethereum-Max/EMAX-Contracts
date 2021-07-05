const EMaxCoin = artifacts.require("EMaxCoin");

contract('EMaxCoin', (accounts) => {
  var coinInstance;

  // TEST LIFE CYCLE

  beforeEach(async () => {
    coinInstance = await EMaxCoin.deployed();
  })

  // TESTS

  // initialize()

  describe('initialize', () => {
    it('should have a name', async () => {
      assert.equal(await coinInstance.name(), "EthereumMax", " The name changed");
    })

    it('should have a symbol', async () => {
      assert.equal(await coinInstance.symbol(), "eMax", " The symbol changed");
    })

    it('should have decimals', async () => {
      assert.equal(await coinInstance.decimals(), 18, " The decimals changed");
    })
  })

  // balanceOf(account)

  describe('balanceOf', () => {
    let balance;
    let account;

    before(async () => {
      // given
      account = accounts[0];

      // when
      balance = await coinInstance.balanceOf(account);
    })

    // then
    it('should have put total minting supply in first account on creation', () => {
      assert.equal(balance, 2000000000 * 10**6 * 10**18, "10000 wasn't in the first account");
    })
  })

  // transfer(recipient, amount)

  describe('transfer', () => {
    let accountOne, accountTwo;
    let accountOneStartingBalance, accountTwoStartingBalance;
    let amount;

    before(async () => {
      // given
      accountOne = accounts[0];
      accountTwo = accounts[1];
      accountOneStartingBalance = await coinInstance.balanceOf(accountOne);
      accountTwoStartingBalance = await coinInstance.balanceOf(accountTwo);
      amount = 10000;

      // when
      await coinInstance.transfer(accountTwo, amount, { from: accountOne });
    })

    it('should deduct from the first account', async () => {
      const accountOneEndingBalance = await coinInstance.balanceOf(accountOne);
      assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount was correctly deducted");
    })

    it('should increase the balance of the second account', async () => {
      const reflect = amount * 0.06;
      const reflectedAmount = amount - reflect;
      const accountTwoEndingBalance = await coinInstance.balanceOf(accountTwo);
      assert.equal(Number(accountTwoEndingBalance), Number(accountTwoStartingBalance) + Number(reflectedAmount));
    })
  })
});
