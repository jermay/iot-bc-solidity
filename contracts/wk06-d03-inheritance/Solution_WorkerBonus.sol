pragma solidity 0.5.12;

import "./Solution_PeopleBonus.sol";

contract WorkerBonusSolution is PeopleSolutionBonus {

    mapping (address => uint) public salary;
    mapping(address => address) public bossOf;

    event workerCreated(address workerAddress, uint salary, address boss);
    event workerFired(address workerAddress, address firedBy);

    // worker is created by their boss
    // could also include another param for the boss address
    // could also add extra functionaly for an "onlyBoss" modifier
    function createWorker (string memory _name, uint _age, uint _height, uint _salary, address _workerAddress)
    public
    {
        require(_workerAddress != msg.sender, "worker cannot be own boss");
        require (_age <= 75, "too old");
        _createPerson(_workerAddress, _name,_age,_height);
        salary[_workerAddress] = _salary;
        bossOf[_workerAddress] = msg.sender;

        emit workerCreated(_workerAddress, _salary, msg.sender);
    }

    function fire (address _workerAddress)
    public
    {
        require (msg.sender == bossOf[_workerAddress], "sender not worker's boss");
        _deletePerson(_workerAddress);
        delete(salary[_workerAddress]);
        delete(bossOf[_workerAddress]);

        emit workerFired(_workerAddress, msg.sender);
    }
}

/*
Bonus Assignment

* Make sure that a worker can only be fired by his/her boss. For each worker
  created, you need to input and save information about who (which address) is
  the boss. This should be implemented in the Worker contract.

* A worker is not allowed to be his/her own boss. 

* By implementing a new function in the base contract, used by both deletePerson
  and fire, make sure there is as little code duplication as possible between
  the deletePerson function and the fire function.
*/