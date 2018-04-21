const SimpleToken = artifacts.require('./SimpleToken.sol');
const config = require('../config');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(
    SimpleToken,
    config.token.name,
    config.token.symbol,
    config.token.totalSupply
  );
};
