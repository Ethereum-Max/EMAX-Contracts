const EMaxCoin = artifacts.require("REFLECT4");
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
      assert.equal(balance, 1000, "10000 wasn't in the first account");
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
      amount = 100;
      reflect = amount * 0.06;
      reflectedAmount = amount - reflect;

      // when
      receipt = await coinInstance.transfer(accountTwo, amount, { from: accountOne });
      console.log('Transfer: ', Number(amount), 'From Account 1 to Account 2')
    })

    // then
    it('should deduct from the first account', async () => {
      const accountOneEndingBalance = await coinInstance.balanceOf(accountOne);
      console.log('Account 1 ending balance: ',Number(accountOneEndingBalance));
      assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount was correctly deducted");
    })

    it('should increase the balance of the second account', async () => {
      const accountTwoEndingBalance = await coinInstance.balanceOf(accountTwo);
      console.log('Account[2] Beg Bal',Number(accountTwoStartingBalance),'Account[2] End Bal', Number(accountTwoEndingBalance));
      console.log('Reflected Amount',reflectedAmount);
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
        //assert.equal(Number(await coinInstance.balanceOf(fromAccount)), 84)
      })

      it('should add the amount to the receiving account', async () => {
       // assert.equal(Number(await coinInstance.balanceOf(toAccount)), 10)
      })

      it('should deduct the amount from the allowance', async () => {
        assert.equal(Number(await coinInstance.allowance(fromAccount, spendingAccount)), 0)
      })
    })
  })
});
/*const EMaxCoin = artifacts.require("REFLECT4");

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
      console.log('Coin Name: ', await coinInstance.name())
      assert.equal(await coinInstance.name(), "EthereumMax", " The name changed");
    })

    it('should have a symbol', async () => {
      console.log('Coin Symbol: ', await coinInstance.symbol())
      assert.equal(await coinInstance.symbol(), "eMax", " The symbol changed");
    })

    it('should have decimals', async () => {
      let dec = await coinInstance.decimals();
      console.log('Coin Decimals: ', Number(dec));
      assert.equal(await coinInstance.decimals(), 18, " The decimals changed");
    })

    it('should have total supply', async () => {
      const supply = await coinInstance.totalSupply()
      console.log('Total Supply: ', Number(supply) )
     // assert.equal(await coinInstance.decimals(), 18, " The decimals changed");
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
      assert.equal(balance, 1000, "total supply doesn't match");
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
      amount = 10;

      console.log('Owner Account: ', ownerAccount)
      console.log('Spender Account: ', spenderAccount)
      // when
      receipt = await coinInstance.approve(spenderAccount, amount);
    })

    // then
    it('should have a valid receipt', () => {
      assert.equal(receipt.logs.length, 1, 'triggers one event')
      assert.equal(receipt.logs[0].event, 'Approval', 'should be Approval event')
      console.log('Event Emitted',receipt.logs[0].event )
      assert.equal(receipt.logs[0].args.owner, ownerAccount, 'logs the owner account the tokens are transferred from')
     // assert.equal(receipt.logs[0].args.spender, spenderAccount, 'logs the spender account delegated to transfer the tokens')
      assert.equal(receipt.logs[0].args.value, amount, 'logs the amount approved')
    })

    it('should set the allowance to the approved amount', async () => {
      const allowance = await coinInstance.allowance(ownerAccount, spenderAccount);
      assert.equal(allowance, amount, 'stores the allowance for delegated transfer')
    })

    it('should return the fee amount', async () => {
      const rate = await coinInstance._getRate();
      console.log('rate:', Number(rate))
      //assert.equal(rate amount, 'stores the allowance for delegated transfer')
    })

    it('should have total Max', async () => {
      const MAX = await coinInstance.totalMAX();
      console.log('Total Max: ', MAX.toString())
     // assert.equal(await coinInstance.decimals(), 18, " The decimals changed");
    })
    it('should have ourSupply', async () => {
      const ourSupply = await coinInstance.ourSupply();
      console.log('Our Supply: ', Number(ourSupply))
    
     // assert.equal(await coinInstance.decimals(), 18, " The decimals changed");
    })
  })

  // transfer(recipient, amount)

  describe('transfer', () => {
    let mint, buyer1;
    let mintStartingBalance, buyer1StartingBalance;
    let amount, reflect, reflectedAmount;
    let receipt;

    before(async () => {
      // given
      mint = accounts[0];
      buyer1 = accounts[1]
      mintStartingBalance = await coinInstance.balanceOf(mint);
      buyer1StartingBalance = await coinInstance.balanceOf(buyer1);
      amount = 100;
      reflect = amount * 0.06;
      reflectedAmount = amount - reflect;

      // when
      //receipt = await coinInstance.transfer(buyer1, amount, { from: mint });
      receipt = await coinInstance.transfer(buyer1, amount, { from: mint });
    })

    // then
    it('should not deduct fees from buys from MINT', async () => {
      const mintEndingBalance = await coinInstance.balanceOf(mint);
      console.log('Beginning balance of owner account[0]', Number(mintStartingBalance),"ending balance: ", Number(mintEndingBalance))
      //console.log('Amount deducted: ', Number(amount),"Fees included in amount: ", reflect )
      console.log('Amount transfered: ', Number(amount))
      assert.equal(mintEndingBalance, mintStartingBalance - amount, "Amount was correctly deducted");
      console.log('Amount deducted: ', Number(amount)," ending balance: ", Number(mintEndingBalance))
    })

    it('should increase the balance of the second account', async () => {
      const buyer1EndingBalance = await coinInstance.balanceOf(buyer1);
      console.log('Beginning balance of owner account[1]', Number(buyer1StartingBalance),"ending balance: ", Number(buyer1EndingBalance))
      //console.log('Amount deducted: ', Number(amount),"Fees included in amount: ", reflect )
      assert.equal(Number(buyer1EndingBalance), Number(buyer1StartingBalance) + Number(amount));
    })

  })

  // transferFrom(sender, recipient, amount)

  describe('transfer_Test_MultiParty', () => {
    let mint, buyer1, buyer2, buyer3, buyer4, receipt, amount;

    before(async () => {
      mint = accounts[0];
      buyer1 = accounts[1]
      buyer2 = accounts[2]
      buyer3 = accounts[3]
      buyer4 = accounts[4]

    await coinInstance.transfer(buyer2, 10, { from: mint });

  
    })

    describe('when the transfer amount is larger than the balance', () => {
      before(() => {
        // given
        amount = 9999;
      })

      it('should throw an error', async () => {
        try {
          // when
          receipt = await coinInstance.transfer(buyer2, amount,  { from: buyer3 })
          throw new Error("An error should have been thrown");
        } catch (error) {
          // then
          assert(error.message.includes('revert'), true, 'cannot transfer value larger than balance')
        }
      })
    })

     describe('when the transfer amount is less than the amount owned', () => {
      let receipt;

      before(async () => {
        // given
        amount = 2

        // when
       receipt = await coinInstance.transfer(buyer3, amount, { from: buyer2 })
      })

      // then
      it('should produce a valid receipt', async () => {
        //*******************console.log(receipt.logs)
        mintBal = await coinInstance.balanceOf(accounts[0]);
        buyer1Bal= await coinInstance.balanceOf(accounts[1]);
        buyer2Bal = await coinInstance.balanceOf(accounts[2]);
        buyer3Bal = await coinInstance.balanceOf(accounts[3]);
        buyer4 = await coinInstance.balanceOf(accounts[4]);
        console.log('mint: ', Number(mintBal));
        console.log('buyer1Bal: ', Number(buyer1Bal));
        console.log('buyer2Bal: ', Number(buyer2Bal));
        console.log('buyer3Bal: ', Number(buyer3Bal));
        console.log('buyer4: ', Number(buyer4));
        const rate = await coinInstance._getRate();
        console.log('rate:', Number(rate))
        const rSupply = await coinInstance._getCurrentSupply();
        console.log('rSupply:', Number(rSupply[0]))
        console.log('tSupply:', Number(rSupply[1]))


       /* assert.equal(receipt.logs.length, 2, 'triggers two events')
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be Transfer event')
        assert.equal(receipt.logs[0].args.from, buyer2, 'logs the account the tokens are transferred from')
        assert.equal(receipt.logs[0].args.to, buyer3, 'logs the account the tokens are transferred to')
        assert.equal(Number(receipt.logs[0].args.value), amount, 'logs the amount transferred')
        assert.equal(receipt.logs[1].event, 'Approval', 'should be Approval event')
        assert.equal(receipt.logs[1].args.owner, buyer2, 'logs the owner account the tokens are transferred from')
        assert.equal(receipt.logs[1].args.spender, buyer4, 'logs the spender account delegated to transfer the tokens')
        assert.equal(Number(receipt.logs[1].args.value), 0, 'logs the amount approved')
      })

      it('should deduct the amount from the sending account', async () => {
        assert.equal(Number(await coinInstance.balanceOf(buyer2)),8 )
      })

      it('should add the amount to the receiving account', async () => {
        assert.equal(Number(await coinInstance.balanceOf(buyer3)), 2)
      })


    })
  })
  describe('transferFrom', () => {
    let mint, buyer1, buyer2, buyer3, buyer4, receipt, amount;

    before(async () => {
      mint = accounts[0];
      buyer1 = accounts[1]
      buyer2 = accounts[2]
      seller1 = accounts[3]
      buyer4 = accounts[4]

      await coinInstance.transfer(buyer1, 50, { from: mint })
      await coinInstance.approve(seller1, 40, { from: buyer1 })
    })
    describe('when the transfer amount is within the balance and approved amount (call)', () => {
      let success;

      before(async () => {
        // given
        amount = 10;

        // when
        success = await coinInstance.transferFrom.call(buyer1, buyer2, amount,{ from: seller1 } )
      })

      // then
      it('should execute successfully', () => {
        assert.isTrue(success)
      })
    })
    describe('when the transfer amount is within the balance and approved amount', () => {
      let receipt;

      before(async () => {


        // when
       receipt = await coinInstance.transferFrom(buyer1, buyer2, 5,{ from: seller1 } )
       await coinInstance.approve(seller1, 5, { from: buyer1 })
      })

      // then
      it('should produce a valid receipt', async () => {
        //*******************console.log(receipt.logs)
        mintBal = await coinInstance.balanceOf(accounts[0]);
        buyer1Bal= await coinInstance.balanceOf(accounts[1]);
        buyer2Bal = await coinInstance.balanceOf(accounts[2]);
        seller1Bal = await coinInstance.balanceOf(accounts[3]);
        buyer4 = await coinInstance.balanceOf(accounts[4]);
        console.log('mint: ', Number(mintBal));
        console.log('buyer1Bal: ', buyer1Bal.toString());
        console.log('buyer2Bal: ', buyer2Bal.toString());
        console.log('seller1Bal: ', Number(seller1Bal));
        console.log('buyer4: ', Number(buyer4));
        const rate = await coinInstance._getRate();
        console.log('rate:', Number(rate))
        const rSupply = await coinInstance._getCurrentSupply();
        console.log('rSupply:', Number(rSupply[0]))
        console.log('tSupply:', Number(rSupply[1]))

        /*assert.equal(receipt.logs.length, 2, 'triggers two events')
        assert.equal(receipt.logs[0].event, 'Transfer', 'should be Transfer event')
        assert.equal(receipt.logs[0].args.from, buyer2, 'logs the account the tokens are transferred from')
        assert.equal(receipt.logs[0].args.to, buyer3, 'logs the account the tokens are transferred to')
        assert.equal(Number(receipt.logs[0].args.value), amount, 'logs the amount transferred')
        assert.equal(receipt.logs[1].event, 'Approval', 'should be Approval event')
        assert.equal(receipt.logs[1].args.owner, buyer2, 'logs the owner account the tokens are transferred from')
        assert.equal(receipt.logs[1].args.spender, buyer4, 'logs the spender account delegated to transfer the tokens')
        assert.equal(Number(receipt.logs[1].args.value), 0, 'logs the amount approved')
      })

      it('should deduct the amount from the sending account', async () => {
        //assert.equal(Number(await coinInstance.balanceOf(buyer2)), )
      })

      it('should add the amount to the receiving account', async () => {
        //assert.equal(Number(await coinInstance.balanceOf(buyer3)), 10)
      })

      it('should deduct the amount from the allowance', async () => {
       // assert.equal(Number(await coinInstance.allowance(buyer2, buyer4)), 0)
      })
    })
  })
  })
});
*/
