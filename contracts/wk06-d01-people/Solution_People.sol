pragma solidity 0.5.12;

contract HelloWorldSolution {
    struct Person {
        address creator;
        string name;
        uint256 age;
        uint256 height;
        bool senior;
    }

    Person[] private people;
    mapping (address => uint) public addressToPeopleCreated;

    function createPerson(
        string memory _name,
        uint256 _age,
        uint256 _height
    ) public {
        Person memory newPerson;
        newPerson.creator = msg.sender;
        newPerson.name = _name;
        newPerson.age = _age;
        newPerson.height = _height;
        if (_age >= 65) {
            newPerson.senior = true;
        }
        people.push(newPerson);
        addressToPeopleCreated[msg.sender]++;
    }

    function getPerson(uint256 _id)
        public
        view
        returns (
            address creator,
            string memory name,
            uint256 age,
            uint256 height,
            bool senior
        )
    {
        return (
            people[_id].creator,
            people[_id].name,
            people[_id].age,
            people[_id].height,
            people[_id].senior
        );
    }

    function getIdsByAddress(address _address) public view returns (uint[] memory) {
        // use count mapping to set memory array return size
        uint peopleCount = addressToPeopleCreated[_address];
        if (peopleCount == 0) {
            return new uint[](0);
        }

        // iterate through the poeple array until all the
        // people created by _address are found or the end
        // of the array is reached
        uint[] memory ids = new uint[](peopleCount);
        uint idCount = 0;
        for(uint i=0; i < peopleCount && i < people.length; i++) {
            if (people[i].creator == _address) {
                ids[idCount] = i;
                idCount++;
            }
        }

        return ids;
    }
}

/*
Week 6, Day 1:
People Array Assignment
Your assignment for today is to make a copy of the Helloworld
contract and make a few changes. Make sure to keep your
original People contract as well, since we will continue to
work on that tomorrow.

* Instead of having a mapping where we store people,
 create a new array where we can store the people. 

* When someone creates a new person, add the Person object to
 the people array instead of the mapping.

* Create a public get function where we can input an index and
  retrieve the Person object with that index in the array.

* Modify the Person struct and add an address property Creator.
  Make sure to edit the createPerson function so that it sets
  this property to the msg.sender.

Bonus Assignments

* Create a new mapping (address to uint) which stores the
  number of people created by a specific address.

* Modify the createPerson function to set/update this mapping
  for every new person created.

Bonus Assignment #2 [Difficult]

* Create a function that returns an array of all the ID's that
  the msg.sender has created.

Submit your code in Google Classroom.
*/
