const ehrExtract = require("./main");
const AWS = require("aws-sdk-mock");
const uuid = require("uuid/v4");
const sinon = require('sinon');

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
  let result;

  beforeAll(async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', function (params, callback){
      callback(null, Promise.reject('Oops!'));
    });
    let event = {'body': '{"payload": "something"}'};
    result = await ehrExtract.handler(event);
  });

  test("That if there is an error when saving the data, it generates a REJECTED response", async () => {
    expect(result.body).toBe("{\"status\":\"REJECTED\"}");
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});

describe("ACCEPTED responses", () => {
  let result;
  var putSpy = sinon.spy();

  beforeAll(async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', putSpy);
    result = await ehrExtract.main(new ErrorDBMock());
  });

  test("That if there is no error, it generates an ACCEPTED response", async () => {
    const result = await ehrExtract.main(new DynamoDBMock());
    expect(result.currentStatus).toBe("ACCEPTED");
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});
