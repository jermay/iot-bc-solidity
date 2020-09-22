pragma solidity 0.5.12;

import "./Solution_People.sol";

contract WorkerSolution is PeopleSolution {
    mapping(address => uint256) public salary;

    // requires msg.sender to be the worker!
    function createWorker(
        string memory _name,
        uint256 _age,
        uint256 _height,
        uint256 _salary
    ) public {
        require(_age <= 75, "too old");
        createPerson(_name, _age, _height);
        salary[msg.sender] = _salary;
    }

    function fire(address _workerAddress) public {
        deletePerson(_workerAddress);
        delete (salary[_workerAddress]);
    }
}

/*
Week 6, Day 3, Inheritance Assignment Checklist

Inheritance Assignment
Today's assignment will focus on Inheritance. We will create a new contract that
will extend the functionality of our HelloWorld contract. Therefore, to complete
this assignment, we should make no changes to the Base aka HelloWorld Contract
(except one small exception).

What we are creating today is not a very useful application, but it is a good
assignment on Inheritance. You will learn about better ways to store unique
information on the blockchain further down the curriculum.

For clarity, start by renaming your contract from HelloWorld to People. You can
also disregard our External.sol file, we won't be using it anymore. 

Then, create a file with new contract called Workers, which should inherit from
People. Then implement the functionality listed below. When you are done. Hand
in a link to your code to Google Classroom for the Inheritance Assignment.

The Workers-contract should have the following functions and properties:

* Should inherit from the People Contract. 

* Should extend the People contract by adding another mapping called salary
  which maps an address to an integer. 

* Have a createWorker function which is a wrapper function for the createPerson
  function. Make sure to figure out the correct visibility level for the
  createPerson function (it should no longer be public). This is the only
  modification we should do in the People contract.

* Apart from calling the createPerson function, the createWorker function should
  also set the salary for the Worker in the new mapping.

* When creating a worker, the persons age should not be allowed to be over 75. 

* Implement a fire function, which removes the worker from the contract.

There are conflicting requirements in the assignment.
* `createPerson()` will always assign the creator to `msg.sender`... `createWorker()` calls `createPerson()` so whatever address creates the worker will be that worker's creator
* To delete a person you need to supply the address of the creator... but if only the boss can fire a worker then the boss MUST be the creator and must be the one to create the worker... but the requirement that "the worker cannot be their own boss" directly conflicts with this as the `msg.sender` to `createWorker()` MUST be the boss. This is a flaw in the design of the base contract.

*/
