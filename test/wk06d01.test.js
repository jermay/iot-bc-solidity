const People = artifacts.require("HelloWorld");

const BN = web3.utils.BN
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

contract.only('Poeple', async (accounts) => {
    let instance;
    let youngPerson;
    let seniorPerson;
    beforeEach(async () => {
        youngPerson = {
            creator: accounts[1],
            name: 'Bob',
            age: new BN('40'),
            height: new BN('160'),
            senior: false
        };
        seniorPerson = {
            creator: accounts[2],
            name: 'Jon',
            age: new BN('65'),
            height: new BN('165'),
            senior: true
        }
        instance = await People.new();
    });

    function createPerson(person) {
        return instance.createPerson(
            person.name,
            person.age,
            person.height,
            { from: person.creator }
        );
    }

    function getPersonCount(address) {
        return instance.addressToPeopleCreated(address);
    }

    function getIdsByAddress(address) {
        return instance.getIdsByAddress(address);
    }

    describe('create person', () => {
        it('should store the person in the array', async () => {
            await createPerson(youngPerson);

            const actual = await instance.getPerson(0);

            expect(actual.name).to.equal(youngPerson.name, 'name');
            expect(actual.age.toString(10)).to.equal(youngPerson.age.toString(10), 'age');
            expect(actual.height.toString(10)).to.equal(youngPerson.height.toString(10), 'height');
            expect(actual.senior).to.equal(youngPerson.senior, 'senior');
        });

        it('should set senior to true when 65 or older', async () => {
            await createPerson(seniorPerson);

            const actual = await instance.getPerson(0);

            expect(actual.senior).to.equal(true, 'senior');
        });

        it('should set the creator to the sender', async () => {
            await createPerson(youngPerson);

            const actual = await instance.getPerson(0);

            expect(actual.creator).to.equal(youngPerson.creator, 'creator');
        });
    });

    describe('get person', () => {
        it('should get the person at the specified index', async () => {
            await createPerson(seniorPerson);
            await createPerson(youngPerson);

            const actual = await instance.getPerson(1);

            expect(actual.name).to.equal(youngPerson.name, 'name');
            expect(actual.age.toString(10)).to.equal(youngPerson.age.toString(10), 'age');
            expect(actual.height.toString(10)).to.equal(youngPerson.height.toString(10), 'height');
            expect(actual.senior).to.equal(youngPerson.senior, 'senior');
        });
    });

    describe('Bonus #1', () => {
        it('should increment the count for sender when creating a person', async () => {
            const creator = accounts[1];
            youngPerson.creator = creator;
            seniorPerson.creator = creator;

            await createPerson(youngPerson);

            const firstCount = await getPersonCount(creator);
            expect(firstCount.toString(10)).to.equal('1', 'first count');

            await createPerson(seniorPerson);

            const secondCount = await getPersonCount(creator);
            expect(secondCount.toString(10)).to.equal('2', 'second count');
        });

        it('the counts should be separate for different addresses', async () => {
            await createPerson(youngPerson);
            await createPerson(seniorPerson);

            const youngCount = await getPersonCount(youngPerson.creator);
            expect(youngCount.toString(10)).to.equal('1');

            const seniorCount = await getPersonCount(seniorPerson.creator);
            expect(seniorCount.toString(10)).to.equal('1');
        });
    });

    describe('Bonus #2', () => {
        it('should return an array of all IDs created by the sender', async () => {
            // create some test people from different accounts
            const creator = youngPerson.creator;
            const otherCreator = seniorPerson.creator;
            const testPeople = [
                youngPerson,
                seniorPerson,
                {
                    creator: creator,
                    name: 'Beth',
                    age: new BN('35'),
                    height: new BN('150'),
                    senior: false
                },
                {
                    creator: otherCreator,
                    name: 'Marie',
                    age: new BN('70'),
                    height: new BN('145'),
                    senior: true
                }
            ];
            for (let person of testPeople) {
                await createPerson(person);
            }

            const result = await getIdsByAddress(creator);

            const expectedIds = ['0', '2'];
            expect(result.length).to.equal(2, 'expect 2 results');

            result.map(r => r.toString(10))
                .forEach(result => expect(expectedIds)
                    .to.contain(result));
        });

        it('should return an empty array if no people have been created', async () => {
            const result = await getIdsByAddress(accounts[0]);

            expect(result.length).to.equal(0);
        });
    })
});