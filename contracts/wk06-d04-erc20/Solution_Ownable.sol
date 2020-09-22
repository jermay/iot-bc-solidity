pragma solidity ^0.5.12;

contract Ownable {
    address payable owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "This function is restricted to the owner"
        );
        _;
    }
}
