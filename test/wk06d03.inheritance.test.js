// const Workers = artifacts.require("WorkerSolution");
// const People = artifacts.require("PeopleSolution");
const Workers = artifacts.require("WorkerBonusSolution");
const People = artifacts.require("PeopleSolutionBonus");

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
        const bossCreatesWorkers = true; // set to true for bonus solution
        // console.log(`bossAccount: ${bossAccount}, workerAccount: ${workerAccount}`);

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
            const createWorkersFrom = bossCreatesWorkers ?
                boss : worker.account;
            return instance.createWorker(
                worker.name,
                worker.age,
                worker.height,
                worker.salary,
                worker.account,
                { from: from || createWorkersFrom }
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

                it('should REVERT if sender and boss are the same', async () => {
                    await truffleAssert.reverts(
                        createWorker(worker.account, worker, worker.account),
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

                it(`should remove the worker's boss`, async () => {
                    await fire(worker);
    
                    const result = await getBoss(worker.account);
    
                    expect(result).to.equal(zeroAddress);
                });
    
            });
        });
    });

});
