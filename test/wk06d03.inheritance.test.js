// const Workers = artifacts.require("WorkerSolution");
const Workers = artifacts.require("WorkerBonusSolution");
const People = artifacts.require("PeopleSolution");

const BN = web3.utils.BN
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');
const { zeroAddress } = require('./testUtils');

describe.only('Inheritance Assignment', () => {

    /*
     * Common wrapped functions
    */
    async function getPerson(instance, from) {
        return instance.getPerson({ from: from || accounts[0] });
    }

    function expectPerson(actual, expected) {
        expect(actual.name).to.equal(expected.name, 'name');
        expect(actual.age.toString(10)).to.equal(expected.age.toString(10), 'age');
        expect(actual.height.toString(10)).to.equal(expected.height.toString(10), 'height');
        expect(actual.senior).to.equal(expected.senior, 'senior');
    }

    contract('Worker', async (accounts) => {
        const bossAccount = accounts[1];
        const workerAccount = accounts[2];
        console.log(`bossAccount: ${bossAccount}, workerAccount: ${workerAccount}`);

        let worker;
        let instance;
        beforeEach(async () => {
            worker = {
                account: workerAccount,
                name: 'Robert',
                age: new BN('40'),
                height: new BN('170'),
                senior: false,
                salary: new BN('50000'),
                boss: bossAccount
            }
            instance = await Workers.new();
        });

        /*
         * Wrapper functions
        */
        async function createWorker(boss, worker, from) {
            return instance.createWorker(
                worker.name,
                worker.age,
                worker.height,
                worker.salary,
                boss,
                { from: from || worker.account }
            );
        }

        async function getSalary(address) {
            return instance.salary(address);
        }

        async function fire(worker, from) {
            return instance.fire(
                worker.account,
                { from: from || worker.boss }
            );
        }

        async function getBoss(address) {
            return instance.bossOf(address);
        }

        describe('create worker', () => {
            it('should set the worker salary', async () => {
                await createWorker(bossAccount, worker);

                const result = await getSalary(worker.account);

                expect(result.toString(10)).to.equal(worker.salary.toString(10));
            });

            it('should create a person with the supplied values', async () => {
                await createWorker(bossAccount, worker);

                const result = await getPerson(instance, worker.account);

                expectPerson(result, worker);
            });

            it('should REVERT if the worker age is over 75', async () => {
                worker.age = 76;
                worker.senior = true;

                await truffleAssert.reverts(
                    createWorker(bossAccount, worker),
                    truffleAssert.ErrorType.REVERT
                );
            });

            describe('bonus', () => {
                it('should store the boss of the worker', async () => {
                    await createWorker(bossAccount, worker);

                    const result = await getBoss(worker.account);

                    expect(result).to.equal(bossAccount);
                });

                it('should REVERT if sender and boss are the same (also implies boss cannot create workers; i.e. worker just create themselves!)', async () => {
                    await truffleAssert.reverts(
                        createWorker(worker.account, worker),
                        truffleAssert.ErrorType.REVERT
                    );
                });
            });
        });

        describe('fire', () => {
            beforeEach(async () => {
                await createWorker(bossAccount, worker);
            });

            it('should remove the worker salary', async () => {
                await fire(worker);

                const result = await getSalary(worker.account);

                expect(result.toString(10)).to.equal('0');
            });

            it.only(`should remove the worker's boss`, async () => {
                await fire(worker);

                const result = await getBoss(worker.account);

                expect(result).to.equal(zeroAddress);
            });

            it('should delete the person', async () => {
                await fire(worker);

                const person = await getPerson(instance, worker.account);

                expect(person.name).to.equal('');
            });

            describe('bonus', () => {
                it('should REVERT if the sender is not the workers boss', async () => {
                    const angryCowokerker = accounts[3];
                    await truffleAssert.reverts(
                        fire(worker, angryCowokerker),
                        truffleAssert.ErrorType.REVERT
                    )
                });
            });
        });
    });

    // The parent contract should still work
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

        describe('create person', () => {
            it('should store the person in the array', async () => {
                await createPerson(youngPerson);

                const actual = await getPerson(instance, youngPerson.creator);

                expectPerson(actual, youngPerson);
            });

            it('should set senior to true when 65 or older', async () => {
                await createPerson(seniorPerson);

                const actual = await getPerson(instance, seniorPerson.creator);

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

                    const result = await getPerson(instance, youngPerson.creator);

                    expectPerson(result, updatedPerson);
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

                const actual = await getPerson(instance, youngPerson.creator);

                expectPerson(actual, youngPerson);
            });
        });
    });
})