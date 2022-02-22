const EPrediction = artifacts.require("EPrediction");

contract("EPrediction", (accounts) => {
  let predictionContract;

  describe("open predictions", () => {
    beforeEach(async () => {
      predictionContract = await EPrediction.new(
        true,
        "This is a test condition",
        accounts[0],
        [accounts[0], accounts[1], accounts[2], accounts[3], accounts[4]]
      );
    });

    it("should add address to whitelist", async () => {
      await predictionContract.addAddressToWhitelist(accounts[4]);
      const added = await predictionContract.whitelist(accounts[4]);

      assert.equal(added, true, "did not add the address to whitelist");
    });

    it("should add new vote from whitelisted account", async () => {
      const ammount = web3.utils.toWei("0.0001", "ether");
      await predictionContract.vote(true, {
        value: ammount,
      });

      await predictionContract.predictors(accounts[0]);
      const totalVotesTrue = await predictionContract.totalVotesOutcomeTrue();

      assert.equal(totalVotesTrue.toString(), 1, "did not add a new vote");
    });

    it("should add ammount to vote from whitelisted account", async () => {
      const ammount = web3.utils.toWei("0.0001", "ether");
      await predictionContract.vote(true, {
        value: ammount,
      });

      await predictionContract.predictors(accounts[0]);
      const totalAmmountVotesTrue =
        await predictionContract.totalAmmountOutcomeTrue();

      assert.equal(
        totalAmmountVotesTrue.toString(),
        ammount,
        "the ammount did not match"
      );
    });

    it("should not add new vote from whitelisted account", async () => {
      try {
        const ammount = web3.utils.toWei("0.0001", "ether");
        await predictionContract.vote(true, {
          from: accounts[6],
          value: ammount,
        });
      } catch (error) {
        assert.ok(error != null, "did add a new vote");
      }
    });

    it("should end the prediction", async () => {
      await predictionContract.endPrediction(true);
      const ended = await predictionContract.predictionEnded();
      assert.equal(ended, true, "did not end the prediction");
    });

    it("should reset the loosers ammount", async () => {
      const ammount = web3.utils.toWei("0.1", "ether");
      const winner = true;
      // Winner
      await predictionContract.vote(true, {
        value: ammount,
      });

      // Winner
      await predictionContract.vote(true, {
        value: ammount,
        from: accounts[1],
      });

      await predictionContract.vote(true, {
        value: ammount,
        from: accounts[2],
      });

      await predictionContract.vote(true, {
        value: ammount,
        from: accounts[4],
      });

      // Looser
      await predictionContract.vote(false, {
        value: web3.utils.toWei("0.1", "ether"),
        from: accounts[3],
      });

      await predictionContract.endPrediction(winner);
      const looser = await predictionContract.predictors(accounts[3]);
      assert.equal(
        looser.ammount.toString(),
        "0",
        "did not reset loosers ammount"
      );
    });

    it("should share the winning ammount", async () => {
      const ammount = web3.utils.toWei("0.1", "ether");
      const winner = true;
      // Winner
      await predictionContract.vote(true, {
        value: ammount,
      });

      // Winner
      await predictionContract.vote(true, {
        value: ammount,
        from: accounts[1],
      });

      await predictionContract.vote(true, {
        value: ammount,
        from: accounts[2],
      });

      await predictionContract.vote(true, {
        value: ammount,
        from: accounts[4],
      });

      // Looser
      await predictionContract.vote(false, {
        value: web3.utils.toWei("0.1", "ether"),
        from: accounts[3],
      });

      await predictionContract.endPrediction(winner);
      const winner1 = await predictionContract.predictors(accounts[0]);
      const winningAmmount = web3.utils.fromWei(winner1.ammount.toString());
      assert.equal(
        winningAmmount,
        "0.125",
        "did not share the winning ammound correctly"
      );
    });

    it("should claim the ammount", async () => {
      const ammount = web3.utils.toWei("1", "ether");
      const winner = true;
      // Winner;
      await predictionContract.vote(true, {
        value: ammount,
      });

      // Winner
      await predictionContract.vote(true, {
        value: ammount,
        from: accounts[1],
      });

      // Looser
      await predictionContract.vote(false, {
        value: ammount,
        from: accounts[3],
      });
      const balanceBefore = web3.utils.fromWei(
        await web3.eth.getBalance(accounts[0])
      );

      await predictionContract.endPrediction(winner);
      await predictionContract.claimAmmount();

      const balanceAfter = web3.utils.fromWei(
        await web3.eth.getBalance(accounts[0])
      );

      assert.ok(
        balanceBefore > balanceAfter,
        "the ammound that was claimed was wrong"
      );
    });
  });

  describe("whitelisted predictions", () => {
    beforeEach(async () => {
      predictionContract = await EPrediction.new(
        false,
        "This is a test condition",
        accounts[0],
        []
      );
    });

    it("should not add address to whitelist when the the prediction is public", async () => {
      // When prediction is public
      try {
        await predictionContract.addAddressToWhitelist(accounts[4]);
      } catch (error) {
        assert.ok(error != null, "did add address to whitelist");
      }
    });

    it("should not add address to whitelist when msg.sender is not the creator", async () => {
      // When prediction is public
      try {
        await predictionContract.addAddressToWhitelist(accounts[4], {
          from: accounts[1],
        });
      } catch (error) {
        assert.ok(error != null, "did add address to whitelist");
      }
    });
  });
});
