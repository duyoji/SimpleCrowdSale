const SimpleToken = artifacts.require('SimpleToken');
const SimpleCrowdsale = artifacts.require('SimpleCrowdsale');
const config = require('../config');

contract('SimpleCrowdsale', async (accounts) => {
  let simpleToken;
  let simpleCrowdsale;

  beforeEach(async () => {
    simpleToken = await SimpleToken.deployed();
    simpleCrowdsale = await SimpleCrowdsale.deployed();
  });

  it('should equal `instance.address` and Contract.address.', async () => {
    expect(simpleCrowdsale.address.startsWith('0x'), '`adress` should start with 0x.').to.be.true;
    expect(simpleCrowdsale.address).to.equal(SimpleCrowdsale.address);
  });

  it('includes all tokens in SimpleCrowdsale.', async () => {
    const totalSupply = await simpleToken.totalSupply();
    const amountOfTokenOfSimpleCrowdsale = await simpleToken.balanceOf(SimpleCrowdsale.address);

    expect(totalSupply.toNumber()).to.equal(amountOfTokenOfSimpleCrowdsale.toNumber());

    // Check if all accounts does not have any tokens even owner of the contracts.
    const testPromises = accounts.map((account) => {
      return simpleToken.balanceOf(account).then(amountOfToken => {
        expect(amountOfToken.toNumber()).to.equal(0);
      });
    });

    await Promise.all(testPromises);
  });

  it('transfers token to sender of ether and collect ether(wei) to the wallet address.', async () => {
    const sender = accounts[1];
    const totalSupply = await simpleToken.totalSupply();
    const sentWei = parseInt(web3.toWei(5, 'ether'), 10);

    /**
     *
     * @param {number} expectedAmountOfTokensOfContract
     * @param {number} expectedAmountOfTokensOfAccount
     */
    const checkAmountOfTokensForContractAndAccount1 = async (expectedAmountOfTokensOfContract, expectedAmountOfTokensOfAccount) => {
      const amountOfTokenOfSimpleCrowdsale = await simpleToken.balanceOf(SimpleCrowdsale.address);
      const amountOfTokenOfAccount1 = await simpleToken.balanceOf(sender);

      expect(amountOfTokenOfSimpleCrowdsale.toNumber()).to.equal(expectedAmountOfTokensOfContract);
      expect(amountOfTokenOfAccount1.toNumber()).to.equal(expectedAmountOfTokensOfAccount);
    };


    // Before sending wei to the contract from the sender(accounts[1]).
    await checkAmountOfTokensForContractAndAccount1(totalSupply.toNumber(), 0);

    // Check wallet status before send wei
    const walletAddress = await simpleCrowdsale.wallet();
    expect(walletAddress).to.equal(config.ico.wallet);
    const originalAmountOfWeiOfWallet = await web3.eth.getBalance(walletAddress);


    // Send wei.
    await simpleCrowdsale.sendTransaction({
      from: sender,
      value: sentWei
    });

    // After sending wei to the contract from the sender(accounts[1]).
    const expectedAmountOfTransferedToken = sentWei * config.ico.rate;
    await checkAmountOfTokensForContractAndAccount1(
      totalSupply.toNumber() - expectedAmountOfTransferedToken,
      expectedAmountOfTransferedToken
    );

    // Check amount of wei(ether) in the wallet increases.
    const updatedAmountOfWeiOfWallet = await web3.eth.getBalance(walletAddress);
    expect(updatedAmountOfWeiOfWallet.toNumber()).to.equal(originalAmountOfWeiOfWallet.toNumber() + sentWei);
  });
});
