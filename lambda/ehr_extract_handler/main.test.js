const ehrExtract = require('./main');

test("That it integrates with AWS Lambda", () => {});

describe("REJECTED responses", () => {
  test("That if there is an error when saving the data, it generates a REJECTED response", () => {
    expect(ehrExtract.main().currentState).toBe("REJECTED");
  });
});
