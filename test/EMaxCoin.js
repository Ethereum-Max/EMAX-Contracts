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

  // approve(spender, amount)

  describe('approve', () => {
    it('approves tokens for delegated transfer', async() => {
      // given
      const account  = accounts[1];
      const amount = 100;

      // when
      const success = await coinInstance.approve.call(account, amount);

      // then
      assert.isTrue(success);
    })

    let receipt, ownerAccount, spenderAccount, amount;

    before(async () => {
      // given
      ownerAccount = accounts[0]
      spenderAccount = accounts[1];
      amount = 100;

      // when
      receipt = await coinInstance.approve(spenderAccount, amount);
    })

    // then
    it('should have a valid receipt', () => {
      assert.equal(receipt.logs.length, 1, 'triggers one event')
      assert.equal(receipt.logs[0].event, 'Approval', 'should be Approval event')
      assert.equal(receipt.logs[0].args.owner, ownerAccount, 'logs the owner account the tokens are transferred from')
      assert.equal(receipt.logs[0].args.spender, spenderAccount, 'logs the spender account delegated to transfer the tokens')
      assert.equal(receipt.logs[0].args.value, amount, 'logs the amount approved')
    })

    it('should set the allowance to the approved amount', async () => {
      const allowance = await coinInstance.allowance(ownerAccount, spenderAccount);
      assert.equal(allowance, amount, 'stores the allowance for delegated transfer')
    })
  })

  // transfer(recipient, amount)

  describe('transfer', () => {
    let accountOne, accountTwo;
    let accountOneStartingBalance, accountTwoStartingBalance;
    let amount, reflect, reflectedAmount;
    let receipt;

    before(async () => {
      // given
      accountOne = accounts[0];
      accountTwo = accounts[1];
      accountOneStartingBalance = await coinInstance.balanceOf(accountOne);
      accountTwoStartingBalance = await coinInstance.balanceOf(accountTwo);
      amount = 10000;
      reflect = amount * 0.06;
      reflectedAmount = amount - reflect;

      // when
      receipt = await coinInstance.transfer(accountTwo, amount, { from: accountOne });
    })

    // then
    it('should deduct from the first account', async () => {
      const accountOneEndingBalance = await coinInstance.balanceOf(accountOne);
      assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount was correctly deducted");
    })

    it('should increase the balance of the second account', async () => {
      const accountTwoEndingBalance = await coinInstance.balanceOf(accountTwo);
      assert.equal(Number(accountTwoEndingBalance), Number(accountTwoStartingBalance) + Number(reflectedAmount));
    })

    it('should produce a valid receipt', () => {
      // console.log(receipt.logs[0]);
      assert.equal(receipt.logs.length, 1, 'triggers one event');
      assert.equal(receipt.logs[0].event, 'Transfer', 'should be Transfer event')
      assert.equal(receipt.logs[0].args.from, accountOne, 'logs the account the tokens are transferred from')
      assert.equal(receipt.logs[0].args.to, accountTwo, 'logs the account the tokens are transferred to')
      assert.equal(Number(receipt.logs[0].args.value), reflectedAmount, 'logs the amount transferred')
    })
  })

  // transferFrom(sender, recipient, amount)

  describe('transferFrom', () => {
    let fromAccount, toAccount, spendingAccount, receipt, amount;

    before(async () => {
      fromAccount = accounts[2]
      toAccount = accounts[3]
      spendingAccount = accounts[4]

      await coinInstance.transfer(fromAccount, 100, { from: accounts[0] })
      await coinInstance.approve(spendingAccount, 10, { from: fromAccount })
    })

    describe('when the transfer amount is larger than the balance', () => {
      before(() => {
        // given
        amount = 9999;
      })

      it('should throw an error', async () => {
        try {
          // when
          receipt = await coinInstance.transferFrom(fromAccount, toAccount, amount)
          throw new Error("An error should have been thrown");
        } catch (error) {
          // then
          assert(error.message.includes('revert'), true, 'cannot transfer value larger than balance')
        }
      })
    })

    describe('when the transfer amount is within the balance and approved amount (call)', () => {
      let success;

      before(async () => {
        // given
        amount = 10;

        // when
        success = await coinInstance.transferFrom.call(fromAccount, toAccount, amount, { from: spendingAccount })
      })

      // then
      it('should execute successfully', () => {
        assert.isTrue(success)
      })
    })

    describe('when the transfer amount is within the balance and approved amount', () => {
      let receipt;

      before(async () => {
        // given
        amount = 10

        // when
        receipt = await coinInstance.transferFrom(fromAccount, toAccount, amount, { from: spendingAccount })
      })

      // then
      it('should produce a valid receipt', () => {
        assert.equal(receipt.logs.length, 2, 'triggers two events')
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be Transfer event')
        assert.equal(receipt.logs[0].args.from, fromAccount, 'logs the account the tokens are transferred from')
        assert.equal(receipt.logs[0].args.to, toAccount, 'logs the account the tokens are transferred to')
        assert.equal(Number(receipt.logs[0].args.value), amount, 'logs the amount transferred')
        assert.equal(receipt.logs[1].event, 'Approval', 'should be Approval event')
        assert.equal(receipt.logs[1].args.owner, fromAccount, 'logs the owner account the tokens are transferred from')
        assert.equal(receipt.logs[1].args.spender, spendingAccount, 'logs the spender account delegated to transfer the tokens')
        assert.equal(Number(receipt.logs[1].args.value), 0, 'logs the amount approved')
      })

      it('should deduct the amount from the sending account', async () => {
        assert.equal(Number(await coinInstance.balanceOf(fromAccount)), 84)
      })

      it('should add the amount to the receiving account', async () => {
        assert.equal(Number(await coinInstance.balanceOf(toAccount)), 10)
      })

      it('should deduct the amount from the allowance', async () => {
        assert.equal(Number(await coinInstance.allowance(fromAccount, spendingAccount)), 0)
      })
    })
  })
});
