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

  beforeAll(async () => {
    AWS.mock('DynamoDB.DocumentClient', 'put', function(params, callback) {
      callback(null, {});
    });
    let event = {'body': '{"payload": "something"}'};
    result = await ehrExtract.handler(event);
  });

  test("returns a successful response", async () => {
    expect(result.statusCode).toBe(200);
  });

  test("That if there is no error, it generates an ACCEPTED response", async () => {
    var jsonBody = JSON.parse(result.body);
    expect(jsonBody.status).toBe("ACCEPTED");
  });

  test("It should return the payload", async () => {
    var jsonBody = JSON.parse(result.body);
    expect(jsonBody.payload).toBe("something");
  });

  afterAll(() => {
    AWS.restore('DynamoDB.DocumentClient');
  });
});
