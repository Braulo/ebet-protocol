describe("poc", () => {
  // Mock data
  let totalYes = 0;
  let totalNo = 0;
  let propabilityYes;
  let propabilityNo = 0;
  let oddsYes = 0;
  let oddsNo = 0;
  let yes = 0;
  let no = 0;
  let votesTotal = 0;

  let Predictionters = [
    { value: 1, vote: false },
    { value: 50, vote: true },
    { value: 50, vote: true },
    { value: 250, vote: true },
  ];

  it("should calculate the odds for voting no", () => {
    Predictionters.forEach((Predictionter) => {
      if (!Predictionter.vote) {
        totalNo += Predictionter.value;
        no++;
      }
    });

    votesTotal = yes + no;

    // The probability in percent for each voteing option
    propabilityNo = (no / votesTotal) * 100;

    // Calucates the decimal odds
    oddsNo = +(1 / (propabilityNo / 100)).toFixed(4);
    assert.equal(oddsNo, 1, "the odds for voting no are wrong");
  });

  it("should calculate the odds for voting yes", () => {
    Predictionters.forEach((Predictionter) => {
      if (Predictionter.vote) {
        totalYes += Predictionter.value;
        yes++;
      }
    });

    votesTotal = yes + no;
    // The probability in percent for each voteing option
    propabilityYes = (yes / votesTotal) * 100;

    // Calucates the decimal odds
    oddsYes = +(1 / (propabilityYes / 100)).toFixed(4);

    assert.equal(oddsYes, 1.3333, "the odds for voting yes are wrong");
  });

  it("should share the winning ammount evenly considering the total value", () => {
    for (let i = 0; i < Predictionters.length; i++) {
      // Winner
      if (!Predictionters[i].vote) {
        // Percentage of the total value of what the person voted for
        const percentageOfTotalNo = +(
          (Predictionters[i].value / totalNo) *
          100
        ).toFixed(4);

        // Percentage(from the total pool the person voted for) of the Loosers total value
        const winValue = (totalYes / 100) * percentageOfTotalNo;
        Predictionters[i].value += winValue;
      }
      // Looser
      else {
        // Losers will just lose their value
        Predictionters[i].value = 0;
      }
    }

    assert(
      Predictionters[0].value,
      351,
      "the winner did get the wrong ammount"
    );
  });
});
