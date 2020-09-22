pragma solidity 0.5.12;

contract PeopleSolution {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOnwer {
        require(owner == msg.sender, "only owner");
        _;
    }

    struct Person {
        string name;
        uint256 age;
        uint256 height;
        bool senior;
    }

    mapping(address => Person) private people;

    event personCreated(string name, bool senior, address createdBy);
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
        require(_age > 0 && _age < 150, "invalid age");
        if (people[msg.sender].age == 0) {
            people[msg.sender].name = _name;
            people[msg.sender].age = _age;
            people[msg.sender].height = _height;

            if (_age >= 65) {
                people[msg.sender].senior = true;
            }
            emit personCreated(_name, people[msg.sender].senior, msg.sender);
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

    // for a boss to fire someone deletePerson cannot be onlyOwner anymore
    function deletePerson(address _creator) public {
        string memory name = people[_creator].name;
        bool isSenior = people[_creator].senior;
        delete (people[_creator]);
        assert(people[_creator].age == 0);
        emit personDeleted(name, isSenior, _creator);
    }
}
