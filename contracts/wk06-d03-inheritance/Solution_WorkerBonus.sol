pragma solidity 0.5.12;

import "./Solution_People.sol";

contract WorkerBonusSolution is PeopleSolution {

    mapping (address => uint) public salary;
    mapping(address => address) public bossOf;

    event workerCreated(address workerAddress, uint salary, address boss);
    event workerFired(address workerAddress, address firedBy);

    // requires the worker to create themselves!
    function createWorker (string memory _name, uint _age, uint _height, uint _salary, address _boss)
    public
    {
        require(_boss != msg.sender, "worker cannot be own boss");
        require (_age <= 75, "too old");
        createPerson(_name,_age,_height);
        salary[msg.sender] = _salary;
        bossOf[msg.sender] = _boss;

        emit workerCreated(msg.sender, _salary, _boss);
    }

    function fire (address _workerAddress)
    public
    {
        require (msg.sender == bossOf[_workerAddress], "sender not worker's boss");
        deletePerson(_workerAddress);
        delete(salary[_workerAddress]);
        delete(bossOf[_workerAddress]);

        emit workerFired(_workerAddress, msg.sender);
    }
}
