const EPredictionFactory = artifacts.require("EPredictionFactory");

contract("EPredictionFactory", () => {
  let contract;
  beforeEach(async () => {
    contract = await EPredictionFactory.deployed();
  });

  it("should create a new prediction", async () => {
    await contract.createPrediction(false, "this is a test condition", []);

    const allPredictions = await contract.getAllPredictions();

    assert.ok(allPredictions.length >= 1, "did not create new prediction");
  });
});

contract("EPredictionFactory", () => {
  let contract;
  beforeEach(async () => {
    contract = await EPredictionFactory.deployed();
  });

  it("should return all predicitons", async () => {
    await contract.createPrediction(false, "this is a test condition1", []);

    await contract.createPrediction(false, "this is a test condition2", []);

    const allPredictions = await contract.getAllPredictions();
    assert.ok(allPredictions.length == 2, "did not return all predictions");
  });
});
