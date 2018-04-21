const SimpleToken = artifacts.require('SimpleToken');
const SimpleCrowdsale = artifacts.require('SimpleCrowdsale');
const config = require('../config');

contract('SimpleToken', async (accounts) => {
  let simpleToken;
  let simpleCrowdSale;

  beforeEach(async () => {
    simpleToken = await SimpleToken.deployed();
    simpleCrowdSale = await SimpleCrowdsale.deployed();
  });

  it('should equal `instance.address` and Contract.address.', async () => {
    expect(simpleToken.address.startsWith('0x'), '`adress` should start with 0x.').to.be.true;
    expect(simpleToken.address).to.equal(SimpleToken.address);
  });

  it(`sets ${config.token.name} as a token name and ${config.token.symbol} as a token symbol`, async () => {
    const name = await simpleToken.name();
    const symbol = await simpleToken.symbol();

    expect(name).to.equal(config.token.name);
    expect(symbol).to.equal(config.token.symbol);
  });

  it(`should be set ${config.token.totalSupply} as a totalSupply.`, async () => {
    const totalSupply = await simpleToken.totalSupply();
    expect(totalSupply.toNumber()).to.equal(config.token.totalSupply);
  });

  it('should be had by SimpleCrowdsale contract initially.', async () => {
    const totalSupply = await simpleToken.totalSupply();
    const amountOfTokenForSimpleCrowdsale = await simpleToken.balanceOf(SimpleCrowdsale.address);

    expect(amountOfTokenForSimpleCrowdsale.toNumber()).to.equal(totalSupply.toNumber());

    // accounts created by truffle does not have any tokens initially.
    const testPromises = accounts.map(account => {
      return simpleToken.balanceOf(account).then(amountOfToken => {
        expect(amountOfToken.toNumber()).to.equal(0);
      });
    });

    await Promise.all(testPromises);
  });

  it('can transfer from SimpleCrowdsale contract to a user, the user to another user.', async () => {
    const userA = accounts[1];
    const userB = accounts[2];
    const totalSupply = await simpleToken.totalSupply();

    /**
     *
     * @param {number} expectedAmountOfTokensForSimpleCrowdsale
     * @param {number} expectedAmountOfTokensUserA
     * @param {number} expectedAmountOfTokensUserB
     */
    const checkAmountOfTokens = async (
      expectedAmountOfTokensForSimpleCrowdsale,
      expectedAmountOfTokensUserA,
      expectedAmountOfTokensUserB
    ) => {
      const amountOfTokenForSimpleCrowdsale = await simpleToken.balanceOf(SimpleCrowdsale.address);
      const amountOfTokenForUserA = await simpleToken.balanceOf(userA);
      const amountOfTokenForUserB = await simpleToken.balanceOf(userB);

      expect(amountOfTokenForSimpleCrowdsale.toNumber()).to.equal(expectedAmountOfTokensForSimpleCrowdsale);
      expect(amountOfTokenForUserA.toNumber()).to.equal(expectedAmountOfTokensUserA);
      expect(amountOfTokenForUserB.toNumber()).to.equal(expectedAmountOfTokensUserB);
    };

    // Before transfering tokens.
    await checkAmountOfTokens(totalSupply.toNumber(), 0, 0);

    // Transfer SimpleCrowdSale's tokens to userA by smart contract when userA sent some wei(ether).
    const sentWei = 100;
    await simpleCrowdSale.sendTransaction({
      from: userA,
      value: sentWei
    });
    const amountOfTransferedTokenFromSimpleCrowdsale = sentWei * config.ico.rate;
    await checkAmountOfTokens(
      totalSupply.toNumber() - amountOfTransferedTokenFromSimpleCrowdsale,
      amountOfTransferedTokenFromSimpleCrowdsale,
      0
    );

    // Trasfer userA's tokens to userB by the "transfer" method.
    const amountFoTransferedTokenFromUserA = amountOfTransferedTokenFromSimpleCrowdsale - 1;
    await simpleToken.transfer(userB, amountFoTransferedTokenFromUserA, {from: userA});
    await checkAmountOfTokens(
      totalSupply.toNumber() - amountOfTransferedTokenFromSimpleCrowdsale,
      amountOfTransferedTokenFromSimpleCrowdsale - amountFoTransferedTokenFromUserA,
      amountFoTransferedTokenFromUserA
    );
  });
});
