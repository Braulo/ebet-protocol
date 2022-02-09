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

  let betters = [
    { value: 1, vote: false },
    { value: 50, vote: true },
    { value: 50, vote: true },
    { value: 250, vote: true },
  ];

  it("should calculate the odds for voting no", () => {
    betters.forEach((better) => {
      if (!better.vote) {
        totalNo += better.value;
        no++;
      }
    });

    votesTotal = yes + no;

    // The probability in percent for each voteing option
    propabilityNo = (no / votesTotal) * 100;

    // Calucates the decimal odds
    oddsNo = +(1 / (propabilityNo / 100)).toFixed(4);
    assert.equal(oddsNo, 1, "The odds for voting no are wrong");
  });

  it("should calculate the odds for voting yes", () => {
    betters.forEach((better) => {
      if (better.vote) {
        totalYes += better.value;
        yes++;
      }
    });

    votesTotal = yes + no;
    // The probability in percent for each voteing option
    propabilityYes = (yes / votesTotal) * 100;

    // Calucates the decimal odds
    oddsYes = +(1 / (propabilityYes / 100)).toFixed(4);

    assert.equal(oddsYes, 1.3333, "The odds for voting yes are wrong");
  });

  it("should share the winning ammount evenly considering the total value", () => {
    for (let i = 0; i < betters.length; i++) {
      // Winner
      if (!betters[i].vote) {
        // Percentage of the total value of what the person voted for
        const percentageOfTotalNo = +(
          (betters[i].value / totalNo) *
          100
        ).toFixed(4);

        // Percentage(from the total pool the person voted for) of the Loosers total value
        const winValue = (totalYes / 100) * percentageOfTotalNo;
        betters[i].value += winValue;
      }
      // Looser
      else {
        // Losers will just lose their value
        betters[i].value = 0;
      }
    }

    assert(betters[0].value, 351, "The winner did get the wrong ammount");
  });
});
