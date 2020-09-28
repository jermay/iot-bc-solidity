pragma solidity 0.5.12;

contract PeopleSolutionBonus {
    address public owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
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
        _createPerson(msg.sender, _name, _age, _height);
    }

    function _createPerson(
        address _address,
        string memory _name,
        uint256 _age,
        uint256 _height
    ) internal {
        // save old values
        // in the "create" case this memory allocation is not
        // necessary but it removes code duplication
        // NOTE: if you allocate separate variables a "stack too deep"
        //       error is thrown
        Person memory oldValues = people[_address];

        // set person values
        people[_address].name = _name;
        people[_address].age = _age;
        people[_address].height = _height;

        if (_age >= 65) {
            people[_address].senior = true;
        }

        if (oldValues.age == 0) {
            // age can never be zero so must be creating
            emit personCreated(_name, people[_address].senior, msg.sender);
        } else {
            emit personUpdated(
                oldValues.name,
                oldValues.age,
                oldValues.height,
                oldValues.senior,
                people[_address].name,
                people[_address].age,
                people[_address].height,
                people[_address].senior
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

    function deletePerson(address _creator) public onlyOwner {
        _deletePerson(_creator);
    }

    function _deletePerson(address _address) internal {
        string memory name = people[_address].name;
        bool isSenior = people[_address].senior;
        delete (people[_address]);
        assert(people[_address].age == 0);
        emit personDeleted(name, isSenior, msg.sender);
    }
}
