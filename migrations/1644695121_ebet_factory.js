const EPredictionFactory = artifacts.require("EPredictionFactory");

module.exports = function async(_deployer) {
  _deployer.deploy(EPredictionFactory);
};
