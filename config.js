const DECIMALS = 18;

const config = {
  token: {
    name: 'Simple Duyoji Token',
    symbol: 'SDT',
    totalSupply: 10000 * (10 ** DECIMALS)
  },
  ico: {
    rate: 3, // The name of "rate" is used in Crowdsale.sol in open-zepplin for exchange tokens per wei.
    wallet: '0x5aeda56215b167893e80b4fe645ba6d5bab767de', // Address of accounts[9] in truffle develop. Ether sent from funder will be received this wallet address.
    // token: '' // Set DemoToken address dynamically after deploying DemoToken.
  }
};

module.exports = config;

