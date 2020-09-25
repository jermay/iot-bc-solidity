pragma solidity 0.5.12;

import "./Solution_Ownable.sol";

contract ERC20Solution is OwnableSolution {
    mapping(address => uint256) private _balances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals
    ) public {
        _name = name;
        _symbol = symbol;
        _decimals = decimals;
    }

    function name() public view returns (string memory) {
        return _name;
    }

    function symbol() public view returns (string memory) {
        return _symbol;
    }

    function decimals() public view returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _account) public view returns (uint256) {
        return _balances[_account];
    }

    function mint(address _account, uint256 _amount) public onlyOwner {
        require(_account != address(0));
        _totalSupply = _totalSupply + _amount;
        _balances[_account] = _balances[_account] + _amount;
    }

    function transfer(address _recipient, uint256 _amount)
        public
        returns (bool)
    {
        require(_recipient != address(this));
        require(_recipient != address(0));
        require(_balances[msg.sender] >= _amount);

        _balances[msg.sender] = _balances[msg.sender] - _amount;
        _balances[_recipient] = _balances[_recipient] + _amount;
        return true;
    }
}

/*
ERC20 Assignment
Download the empty ERC20 contract from the download section here on the right.
Un-zip the file and you will find the ERC20.sol file which contains the code
I am showing in the video. It's up to you to implement the functions. 

When you are finished, please submit a link to your code in Google Classroom
for the ERC20 Assignment.
*/
