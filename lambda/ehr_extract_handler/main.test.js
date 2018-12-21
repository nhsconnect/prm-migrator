const ehrExtract = require("./main");
const AWS = require("aws-sdk");
const uuid = require("uuid/v4");

class ErrorDBMock {
  constructor() {}

  put(params, callback) {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            reject();
          }, 100);
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
          setTimeout(() => {
            resolve();
          }, 100);
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
});

describe("ACCEPTED responses", () => {
  test("That if there is no error, it generates an ACCEPTED response", async () => {
    const result = await ehrExtract.main(new DynamoDBMock());
    expect(result.currentStatus).toBe("ACCEPTED");
  });
});

describe("Integration tests", () => {
  test("Can successfully manage a PROCESS record", async () => {
    const wrapper = new ehrExtract.ProcessStatusWrapper(
      new AWS.DynamoDB.DocumentClient()
    );
    const uniqueId = uuid();
    const putTesult = await wrapper.put({
      PROCESS_ID: uniqueId,
      PROCESS_STATUS: "TESTING"
    });

    const getResult = await wrapper.get(uniqueId);
    const item = getResult.Item;
    expect(item.PROCESS_ID).toBe(uniqueId);
    expect(item.PROCESS_STATUS).toBe("TESTING");

    await wrapper.delete(uniqueId);

    expect(await wrapper.get(uniqueId)).toMatchObject({});
  });
});
