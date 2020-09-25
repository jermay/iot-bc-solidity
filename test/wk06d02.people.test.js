const People = artifacts.require("PeopleUpdateSolution");

const BN = web3.utils.BN
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');

contract('Poeple', async (accounts) => {
    let instance;
    let youngPerson;
    let seniorPerson;
    beforeEach(async () => {
        youngPerson = {
            creator: accounts[1],
            name: 'Bob',
            age: new BN('25'),
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

    function getPerson(from) {
        return instance.getPerson({ from: from || accounts[0] });
    }

    describe('create person', () => {
        it('should store the person in the array', async () => {
            await createPerson(youngPerson);

            const actual = await getPerson(youngPerson.creator);

            expect(actual.name).to.equal(youngPerson.name, 'name');
            expect(actual.age.toString(10)).to.equal(youngPerson.age.toString(10), 'age');
            expect(actual.height.toString(10)).to.equal(youngPerson.height.toString(10), 'height');
            expect(actual.senior).to.equal(youngPerson.senior, 'senior');
        });

        it('should set senior to true when 65 or older', async () => {
            await createPerson(seniorPerson);

            const actual = await getPerson(seniorPerson.creator);

            expect(actual.senior).to.equal(true, 'senior');
        });

        it('should emit a personCreated event', async () => {
            const result = await createPerson(youngPerson);

            truffleAssert.eventEmitted(
                result,
                'personCreated',
                event => event.name == youngPerson.name &&
                    event.senior == youngPerson.senior

            );
        });

        describe('on update', () => {
            let updatedPerson;
            beforeEach(async () => {
                updatedPerson = {
                    creator: youngPerson.creator,
                    name: 'Robert',
                    age: 65,
                    height: 158,
                    senior: true
                }
                await createPerson(youngPerson);
            });

            it('should update the person data', async () => {
                await createPerson(updatedPerson);

                const result = await getPerson(youngPerson.creator);
                expect(result.name).to.equal(updatedPerson.name);
                expect(result.age.toString(10)).to.equal(updatedPerson.age.toString(10));
                expect(result.height.toString(10)).to.equal(updatedPerson.height.toString(10));
            });

            it('should emit a personUpdated event', async () => {
                const result = await createPerson(updatedPerson);

                truffleAssert.eventEmitted(
                    result,
                    'personUpdated',
                    event => event.oldName == youngPerson.name &&
                        event.oldSenior == youngPerson.senior &&
                        event.oldAge.toString(10) == youngPerson.age.toString(10) &&
                        event.oldHeight.toString(10) == youngPerson.height.toString(10) &&
                        event.newName == updatedPerson.name &&
                        event.newSenior == updatedPerson.senior &&
                        event.newAge.toString(10) == updatedPerson.age.toString(10) &&
                        event.newHeight.toString(10) == updatedPerson.height.toString(10)

                );
            });
        });
    });

    describe('get person', () => {
        it('should get the person at the specified index', async () => {
            await createPerson(seniorPerson);
            await createPerson(youngPerson);

            const actual = await getPerson(youngPerson.creator);

            expect(actual.name).to.equal(youngPerson.name, 'name');
            expect(actual.age.toString(10)).to.equal(youngPerson.age.toString(10), 'age');
            expect(actual.height.toString(10)).to.equal(youngPerson.height.toString(10), 'height');
            expect(actual.senior).to.equal(youngPerson.senior, 'senior');
        });
    });

});