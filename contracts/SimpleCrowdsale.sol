pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "./SimpleToken.sol";

contract SimpleCrowdsale is Crowdsale {

  /**
  * @param _rate Number of token units a buyer gets per wei
  * @param _wallet Address where collected funds will be forwarded to
  * @param _token Address of the token being sold
  */
  function SimpleCrowdsale(uint256 _rate, address _wallet, ERC20 _token) public
    Crowdsale(_rate, _wallet, _token)
  {
  }
}
