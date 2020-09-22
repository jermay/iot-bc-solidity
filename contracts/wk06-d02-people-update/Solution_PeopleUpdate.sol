pragma solidity 0.5.12;

contract PeopleUpdate {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOnwer {
        require(owner == msg.sender);
        _;
    }

    struct Person {
        string name;
        uint256 age;
        uint256 height;
        bool senior;
    }

    mapping(address => Person) private people;

    event personCreated(string name, bool senior);
    event personDeleted(string name, bool senior, address deletedBy);
    event personUpdated(
        string oldName,
        uint256 oldAge,
        uint256 oldHeight,
        bool oldSenior,
        string newName,
        uint256 newAge,
        uint256 newHeight,
        bool newSenior
    );

    function createPerson(
        string memory _name,
        uint256 _age,
        uint256 _height
    ) public {
        require(_age > 0 && _age < 150);
        if (people[msg.sender].age == 0) {
            people[msg.sender].name = _name;
            people[msg.sender].age = _age;
            people[msg.sender].height = _height;

            if (_age >= 65) {
                people[msg.sender].senior = true;
            }
            emit personCreated(_name, people[msg.sender].senior);
        } else {
            string memory oldName = people[msg.sender].name;
            uint256 oldAge = people[msg.sender].age;
            uint256 oldHeight = people[msg.sender].height;
            bool oldSenior = people[msg.sender].senior;

            people[msg.sender].name = _name;
            people[msg.sender].age = _age;
            people[msg.sender].height = _height;

            if (_age >= 65) {
                people[msg.sender].senior = true;
            }
            emit personUpdated(
                oldName,
                oldAge,
                oldHeight,
                oldSenior,
                people[msg.sender].name,
                people[msg.sender].age,
                people[msg.sender].height,
                people[msg.sender].senior
            );
        }
    }

    function getPerson()
        public
        view
        returns (
            string memory name,
            uint256 age,
            uint256 height,
            bool senior
        )
    {
        return (
            people[msg.sender].name,
            people[msg.sender].age,
            people[msg.sender].height,
            people[msg.sender].senior
        );
    }

    function deletePerson(address _creator) public onlyOnwer {
        string memory name = people[_creator].name;
        bool isSenior = people[_creator].senior;
        delete (people[_creator]);
        assert(people[_creator].age == 0);
        emit personDeleted(name, isSenior, _creator);
    }
}

/*
Week 6, Day 2
People Update Assignment
In today's assignment, I want you to add some extra functionality
to our Helloworld contract. I want you to use the original
contract that I use in the videos, not the modified one you
created in the assignment yesterday.

Before you do this assignment, you should already have added an
event to your createPerson function, as I did in the Event video.

* Create an event that is called personUpdated. This will be called
whenever someone updates their information in the mapping. It
should contain both the new information and the old information.

* The createPerson function now works for both creating and for
  updating a persons information. In both cases, the function
  will emit a personCreated event. I want you to modify this
  function so that if the msg.sender updates their information,
  we should emit a personUpdated event instead.

This means that if there already is information in the mapping
for the msg.sender, this is now a call to update the person's
information and we should therefore emit the personUpdated event.
*/
