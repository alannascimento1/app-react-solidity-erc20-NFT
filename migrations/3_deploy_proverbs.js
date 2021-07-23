const Proverbs = artifacts.require("Proverbs");

module.exports = function(deployer) {
  deployer.deploy(Proverbs);
};
