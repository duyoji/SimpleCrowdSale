pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract SimpleToken is StandardToken {

  string public name;
  string public symbol;

  /**
  * @dev Constructor that gives msg.sender all of existing tokens.
  */
  function SimpleToken(string _name, string _symbol, uint _totalSupply) public {
    require(bytes(_name).length > 0);
    require(bytes(_symbol).length > 0);
    require(_totalSupply > 0);

    name = _name;
    symbol = _symbol;
    totalSupply_ = _totalSupply;
    balances[msg.sender] = totalSupply_;
    Transfer(0x0, msg.sender, totalSupply_);
  }
}
