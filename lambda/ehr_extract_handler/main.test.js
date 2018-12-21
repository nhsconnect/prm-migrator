const ehrExtract = require("./main");

class ErrorDBMock {
  constructor() {}

  put(params, callback) {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {reject()}, 100);
        });
      }
    };
  }
}

class DynamoDBMock {
  constructor() {}

  put(params) {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
             setTimeout(() => {resolve()}, 100);
        });
      }
    };
  }
}

describe("REJECTED responses", () => {
  test("That if there is an error when saving the data, it generates a REJECTED response", async () => {
    const result = await ehrExtract.main(new ErrorDBMock());
    expect(result.currentStatus).toBe("REJECTED");
  });

  test("That if there is no error, it generates an ACCEPTED response", async () => {
    const result = await ehrExtract.main(new DynamoDBMock());
    expect(result.currentStatus).toBe("ACCEPTED");
  });
});
