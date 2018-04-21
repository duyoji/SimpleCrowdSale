const SimpleToken = artifacts.require('./SimpleToken.sol');
const SimpleCrowdsale = artifacts.require('./SimpleCrowdsale.sol');
const config = require('../config');

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(
    SimpleCrowdsale,
    config.ico.rate,
    config.ico.wallet,
    SimpleToken.address
  );

  const demoToken = SimpleToken.at(SimpleToken.address);
  const totalSupply = await demoToken.totalSupply();

  await demoToken.transfer(SimpleCrowdsale.address, totalSupply.toNumber());
};
