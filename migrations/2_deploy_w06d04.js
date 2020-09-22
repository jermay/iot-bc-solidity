const ERC20 = artifacts.require("ERC20");

module.exports = function (deployer, network, accounts) {
    // mint 100 tokens to account 1 on deploy
    deployer.deploy(ERC20, 'Academy Token', 'ACT', 9)
        .then(contract => contract.mint(accounts[1], 100));
};
