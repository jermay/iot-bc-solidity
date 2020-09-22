const ERC20 = artifacts.require("ERC20");

const BN = web3.utils.BN
const expect = require('chai').expect;
const truffleAssert = require('truffle-assertions');
const { zeroAddress } = require('./testUtils');

const expTokenName = 'Academy Token';
const expTokenSymbol = 'ACT';
const expTokenDecimals = '9';

contract.only('ERC20', async (accounts) => {
    let instance;
    let mintAccount;
    let expAmount;
    beforeEach(async () => {
        mintAccount = accounts[1];
        expAmount = new BN('100');
        instance = await ERC20.new(
            expTokenName, expTokenSymbol, expTokenDecimals);
    });

    it('name should return the contract name', async () => {
        const actual = await instance.name();
        expect(actual).to.equal(expTokenName);
    });

    it('symbol should return the contract symbol', async () => {
        const actual = await instance.symbol();
        expect(actual).to.equal(expTokenSymbol);
    });

    it('decimals should return the number of decimals', async () => {
        const actual = await instance.decimals();
        expect(actual.toString(10)).to.equal(expTokenDecimals);
    });

    function mint(account, amount, from) {
        return instance.mint(
            account,
            amount,
            { from: from || accounts[0] }
        );
    }

    describe('mint, total supply, balance of', () => {

        describe('On deploy', () => {

            it('should mint 100 tokens to account 1', async () => {
                const deployed = await ERC20.deployed();

                const actual = await deployed.totalSupply();
                expect(actual.toString(10)).equals(expAmount.toString(10));

                const balance = await deployed.balanceOf(mintAccount);
                expect(balance.toString(10)).equals(expAmount.toString(10));
            });
        });

        it('should increase the total supply', async () => {
            await mint(mintAccount, expAmount);

            const result = await instance.totalSupply();

            expect(result.toString(10)).to.equal(expAmount.toString(10));
        });

        it('should increase the balance of the given address', async () => {
            await mint(mintAccount, expAmount);

            const result = await instance.balanceOf(mintAccount);

            expect(result.toString(10)).to.equal(expAmount.toString(10));
        });

        it('should REVERT if the account is the zero address', async () => {
            await truffleAssert.reverts(
                mint(zeroAddress, expAmount),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('should REVERT if the sender is NOT the contract owner', async () => {
            const userAccount = accounts[2];
            await truffleAssert.reverts(
                mint(userAccount, expAmount, userAccount),
                truffleAssert.ErrorType.REVERT
            );
        });
    });

    describe('transfer', () => {

        let toAccount;
        beforeEach(async () => {
            toAccount = accounts[2];
            await mint(mintAccount, expAmount);
        });

        function transfer(from, to, amount) {
            return instance.transfer(
                to,
                amount,
                { from }
            );
        }

        it('should subtract amount from sender and add to receiver', async () => {
            await transfer(mintAccount, toAccount, expAmount);

            const fromBal = await instance.balanceOf(mintAccount);
            expect(fromBal.toString(10)).to.equal('0', 'subract from sender');

            const toBal = await instance.balanceOf(toAccount);
            expect(toBal.toString(10)).to.equal(expAmount.toString(10), 'add to receiver');
        });

        // it('should emit a Transfer event', async () => {
        //     const result = await transfer(
        //         mintAccount, toAccount, expAmount
        //     );

        //     truffleAssert.eventEmitted(
        //         result, 'Transfer'
        //     );
        // });

        it('should REVERT if the sender does NOT have enough tokens', async () => {
            const tooMuch = expAmount.mul(new BN('2'));

            await truffleAssert.fails(
                transfer(mintAccount, toAccount, tooMuch),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('should REVERT if the "to" address is zero', async () => {
            await truffleAssert.fails(
                transfer(mintAccount, zeroAddress, expAmount),
                truffleAssert.ErrorType.REVERT
            );
        });

        it('should REVERT if the "to" address is the contract address', async () => {
            const contractAddress = instance.address;
            await truffleAssert.fails(
                transfer(mintAccount, contractAddress, expAmount),
                truffleAssert.ErrorType.REVERT
            );
        });
    });

});
